import { Email } from '../../../src/notification_providers/email';
import { sendEmail } from '../../helpers/mocks/ses/sendEmail';
import { error } from '../../helpers/mocks/aws_error';
import * as faker from 'faker';
import { SES } from 'aws-sdk';
const sinon = require('sinon');

describe('email', () => {
    const email = new Email();
    let message: SES.SendEmailRequest;

    it('should be instantiated', () => {
        expect(email['ses']).toBeDefined();
    });

    describe('buildMessage', () => {
        it('should build an email', (done) => {
            const emailFrom = faker.internet.email();
            const emailTo = faker.internet.email();
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';
            process.env.EMAIL_FROM = emailFrom;
            process.env.EMAIL_TO = emailTo;

            message = email.buildMessage(environment, uploadLocation);
            expect(message.Destination.ToAddresses[0]).toBe(emailTo);
            expect(message.Message.Body.Html.Data).toBeDefined();
            expect(message.Message.Body.Html.Data.includes(uploadLocation)).toBeTruthy();
            expect(message.Message.Subject.Data).toBe(`🦆 Chaos has been invoked in ${environment}!`);
            expect(message.Source).toBe(emailFrom);
            done();
        });

        it('should throw InvalidEmail if emailFrom is invalid', (done) => {
            const emailFrom = 'invalidEmail@gmail';
            const emailTo = faker.internet.email();
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';
            process.env.EMAIL_FROM = emailFrom;
            process.env.EMAIL_TO = emailTo;

            try {
                email.buildMessage(environment, uploadLocation);
            } catch (error) {
                expect(error.stack).toBeDefined();
                expect(error.message).toBe(`${emailFrom} is not a valid email`);
            }

            done();
        });

        it('should throw InvalidEmail if emailTo is invalid', (done) => {
            const emailFrom = faker.internet.email();
            const emailTo = 'invalid.com';
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';
            process.env.EMAIL_FROM = emailFrom;
            process.env.EMAIL_TO = emailTo;

            try {
                email.buildMessage(environment, uploadLocation);
            } catch (error) {
                expect(error.stack).toBeDefined();
                expect(error.message).toBe(`${emailTo} is not a valid email`);
            }

            done();
        });

        it('should throw InvalidUrl if uploadLocation is invalid', (done) => {
            const emailFrom = faker.internet.email();
            const emailTo = faker.internet.email();
            const environment = faker.random.word();
            const uploadLocation = '🦆 ';
            process.env.EMAIL_FROM = emailFrom;
            process.env.EMAIL_TO = emailTo;

            try {
                email.buildMessage(environment, uploadLocation);
            } catch (error) {
                expect(error.stack).toBeDefined();
                expect(error.message).toBe(`${uploadLocation} is not a valid url`);
            }

            done();
        });
    });

    describe('send', () => {
        beforeEach(() => {
            this.send = sinon.stub(email, 'send').returns(sendEmail);
        });

        afterEach(() => {
            this.send.restore();
        });

        it('should send an email', async (done) => {
            const response = await email.send(message);
            expect(response.MessageId).toBeDefined();
            done();
        });

        it('should handle errors', async (done) => {
            try {
                this.send.throws(error);
                await email.send(message);
            } catch (error) {
                expect(error.statusCode).not.toBe(200);
            }

            done();
        });
    });

    describe('sendEmail', () => {
        beforeEach(() => {
            this.send = sinon.stub(email, 'sendEmail').returns(sendEmail);
        });

        afterEach(() => {
            this.send.restore();
        });

        it('should send an email', async (done) => {
            const response = await email.send(message);
            expect(response.MessageId).toBeDefined();
            done();
        });

        it('should handle errors', async (done) => {
            try {
                this.send.throws(error);
                await email.send(message);
            } catch (error) {
                expect(error.statusCode).not.toBe(200);
            }

            done();
        });
    });
});
