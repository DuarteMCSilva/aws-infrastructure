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
import { initialValues } from '../data/initial-data';

let dynamoClient = new AWS.DynamoDB.DocumentClient();

export const postFeedback = async (event, context) => {
    let message;
    const params = parsedRequestBody(event?.body);

    if(params?.name){
        message = `Hello ${params.name}! Your feedback has been received!`;
    } else {
        message = `Error: ${JSON.stringify(params)}. Something went wrong!`;
    }

    try {
        return {
            'statusCode': 200,
            'body': JSON.stringify({ message })
        }
    } catch (err) {
        return {
            'statusCode': 400,
            'body': err
        }
    }
};

export const getFeedback = async (event, context) => {
    populateTable();
    try {
        const response = await getItemById("1");
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

function parsedRequestBody(body) {
    if(typeof body === 'string'){
        return JSON.parse(body);
    } else {
        return JSON.parse(JSON.stringify(body));
    }
};

async function getItemById(id) {
    const DYNAMO_TABLE = process.env.DynamoTable;
    console.log(DYNAMO_TABLE);
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

function populateTable() {
    const TABLE_NAME = process.env.DynamoTable; 
    try {
        initialValues.forEach( (item) => {
            const params = { 
                TableName: TABLE_NAME,
                Item: item
            }
            dynamoClient.put(params, function(err, data) {
                if (err){
                    console.log(TABLE_NAME);
                    console.log(err)}
                else console.log(data);
            })
        } )
    } catch (err) {
        console.log("Log from populate: " + err);
    }
}
