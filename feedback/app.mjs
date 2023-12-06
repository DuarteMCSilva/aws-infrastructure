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

export const lambdaHandler = async (event, context) => {
    let message 
    const params = event.body

    if(params.name){
        message = `Hello ${params.name}!`;
    } else{
        message = `Who is there?`;
    }

    try {
        return {
            'statusCode': 200,
            'body': JSON.stringify({ message })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
};

export const postFeedback = async (event, context) => {
    try {
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Your feedback was received!!',
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
};
