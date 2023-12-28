/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
import AWS from 'aws-sdk';
let dynamoClient = new AWS.DynamoDB.DocumentClient();
const DYNAMO_TABLE = process.env.DynamoTable;
let nextId = 5; // TODO: Decide what is the best approach for primary key (UUID or other).

const putCallback = (err, data) => {
    if(err){
        throw new Error(`Failed to persist!`);
    } else {
        console.log("Success!");
        nextId++;
        return data;
    }
};

export const getFeedback = async (event, context) => {
    /* await populateTable(); */
    try {
        const id = ''+ event.pathParameters.id;
        const response = await getItemById(id);

        if(!response) {
            return  {
                'statusCode': 404,
                'body': JSON.stringify({message: 'Not found!'})
            }
        }
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Feedback: This is your feedback.',
                response: response
            })
        }
    } catch (err) {
        console.log(err);
        return {
            'statusCode': 400,
            'body': JSON.stringify({
                message: 'dynamo.DynamoDB',
            })
        }
    }
};

async function getItemById(id) {
    const params = {
        Key: {
            id : id
        },
        TableName: DYNAMO_TABLE
    }

    return dynamoClient.get(params).promise()
        .then( result => {
            return result.Item;
    }).catch( (err) => err );
};

export const postFeedback = async (event, context) => {
    if (!DYNAMO_TABLE || !dynamoClient) {
        return {
            'statusCode': 500,
            'body': "Environment Error!"
        }
    }

    const body = parsedRequestBody(event?.body);

    const id = nextId + '';
    const userName = body?.name;
    const feedback = body?.feedback;

    if( !body || !userName || !feedback ) {
        return {
            'statusCode': 400,
            'body': "Invalid input format!"
        }
    }

    try {
        const newEntry = {
            id: id,
            name: userName,
            feedback: feedback
        }

        const params =  { 
            TableName: DYNAMO_TABLE,
            Item: newEntry
        }

        const result = await dynamoClient.put(params, putCallback).promise();
        return {
            'statusCode': 200,
            'body': JSON.stringify( result )
        }
    } catch (err) {
        return {
            'statusCode': 400,
            'body': err
        }
    }
};

export const listFeedback = async (event, context) => {
    const params = {
        TableName: DYNAMO_TABLE
    }
    const result = await dynamoClient.scan(params, putCallback).promise();

    return {
        'statusCode': 200,
        'body': JSON.stringify( result.Items )
    }
}

function parsedRequestBody(body) {
    if(!body) return '';
    if(typeof body === 'string'){
        return JSON.parse(body);
    } else {
        return JSON.parse(JSON.stringify(body));
    }
};

/* async function populateTable() {
    const response = await getItemById("1");

    const initialValues = [
        {"id": "4", "name": "John Doe", "feedback": "Hello! I liked the product"} ,
        {"id": "2", "name": "Jane Smith", "feedback": "Excellent product."},
        {"id": "3", "name": "Bob Johnson", "feedback": "Good enough!"} 
      ]

    if(response){
        return;
    }

    try {
        initialValues.forEach( (item) => {
            const params = { 
                TableName: DYNAMO_TABLE,
                Item: item
            }
            dynamoClient.put(params, putCallback);
        } )
        console.log("Log from populate: Success!");
    } catch (err) {
        console.log("Log from populate: " + err);
    }
} */
