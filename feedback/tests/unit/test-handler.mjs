'use strict';

import { lambdaHandler, postFeedback } from '../../app.mjs';
import { expect } from 'chai';

var event, context;

describe('Tests index', function () {
    it('Should greet the user and say his/her name', async () => {
        event = {
            body: { message: "feedback", name: "Mr. Holmes"},
            resource: "{proxy+}"
        }

        const result = await lambdaHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal("Hello Mr. Holmes!");
    });

    it('Should ask who is the user', async () => {
        event = {
            "body": "{\"message\": \"feedback\"}",
            "resource": "/{proxy+}"}
        
        const result = await lambdaHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal(`Who is there?`);
    });

    it('Should give a confirmation of submission', async () => {
        const result = await postFeedback(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal("Your feedback was received!!");
    });
});
