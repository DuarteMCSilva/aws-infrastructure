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

export const postFeedback = async (event, context) => {
    let message 

    const params = parsedRequestBody(event?.body);

    if(params?.name){
        message = `Hello ${params.name}! Your feedback has been received!`;
    } else{
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
    try {
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Feedback: This is your feedback.',
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
};


function parsedRequestBody(body) {
    if(typeof body === 'string'){
        return JSON.parse(body);
    } else {
        return JSON.parse(JSON.stringify(body));
    }
}
