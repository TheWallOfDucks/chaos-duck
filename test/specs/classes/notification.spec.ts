import { Notification } from '../../../src/classes/notification';
import { stopRandomTask } from '../../helpers/mocks/ecs/stopRandomTask';
import { Utility } from '../../../src/classes/utility';
import { Slack } from '../../../src/notification_providers/slack';
import * as faker from 'faker';
const sinon = require('sinon');

describe('notification', () => {
    describe('providers', () => {
        afterEach(() => {
            delete process.env.SLACK_WEBHOOK_URL;
            delete process.env.EMAIL_FROM;
            delete process.env.EMAIL_TO;
        });

        it('should be disabled by default', (done) => {
            const notification = new Notification();
            expect(notification.enabled).toBe(false);
            expect(notification['methods'].length).toBe(0);
            expect(notification['methods']).toEqual([]);
            done();
        });

        it('should support slack', (done) => {
            process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/ABCDE/FGHIJKLMO/290348unfkje234';

            const notification = new Notification();
            expect(notification.enabled).toBe(true);
            expect(notification['slack']).toBeDefined();
            expect(notification['slack']['buildMessage']).toBeDefined();
            expect(notification['slack']['send']).toBeDefined();
            expect(notification['methods'].length).toBe(1);
            expect(notification['methods']).toEqual(['slack']);
            done();
        });

        it('should support email', (done) => {
            process.env.EMAIL_FROM = faker.internet.email();
            process.env.EMAIL_TO = faker.internet.email();

            const notification = new Notification();
            expect(notification.enabled).toBe(true);
            expect(notification['email']).toBeDefined();
            expect(notification['email']['buildMessage']).toBeDefined();
            expect(notification['email']['send']).toBeDefined();
            expect(notification['methods'].length).toBe(1);
            expect(notification['methods']).toEqual(['email']);
            done();
        });

        it('should require both EMAIL_FROM and EMAIL_TO for email to be enabled', (done) => {
            process.env.EMAIL_FROM = faker.internet.email();

            const notification = new Notification();
            expect(notification.enabled).toBe(false);
            expect(notification['methods'].length).toBe(0);
            expect(notification['methods']).toEqual([]);
            done();
        });

        it('should support slack and email', (done) => {
            process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/ABCDE/FGHIJKLMO/290348unfkje234';
            process.env.EMAIL_FROM = faker.internet.email();
            process.env.EMAIL_TO = faker.internet.email();

            const notification = new Notification();
            expect(notification.enabled).toBe(true);
            expect(notification['methods'].length).toBe(2);
            expect(notification['methods']).toEqual(['slack', 'email']);
            done();
        });
    });

    describe('buildMessage', () => {
        afterEach(() => {
            delete process.env.SLACK_WEBHOOK_URL;
            delete process.env.EMAIL_FROM;
            delete process.env.EMAIL_TO;
        });

        it('should build a slack message', (done) => {
            const notification = new Notification();
            const service = Utility.getServiceByValue(stopRandomTask.service);
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';

            const message = notification['buildMessage']('slack', stopRandomTask, environment, uploadLocation);
            expect(message.attachments.length).toBe(1);
            expect(message.attachments[0].fallback).toBe('Chaos Duck has been unleashed');
            expect(message.attachments[0].pretext).toBe('Chaos Duck has been unleashed');
            expect(message.attachments[0].author_name).toBe('Chaos Duck');
            expect(message.attachments[0].title).toBe(`The chosen service is: ${service}`);
            expect(message.attachments[0].text).toBe('Please see information about the chaos below:');
            expect(message.attachments[0].fields[0].title).toBe('Chaos Function');
            expect(message.attachments[0].fields[0].value).toBe(stopRandomTask.action);
            expect(message.attachments[0].actions[0].text).toBe('View Results');
            expect(message.attachments[0].actions[0].url).toBe(uploadLocation);
            done();
        });

        it('should build an email message', (done) => {
            const notification = new Notification();
            const emailFrom = faker.internet.email();
            const emailTo = faker.internet.email();
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';
            process.env.EMAIL_FROM = emailFrom;
            process.env.EMAIL_TO = emailTo;

            const message = notification['buildMessage']('email', stopRandomTask, environment, uploadLocation);
            expect(message.Destination.ToAddresses[0]).toBe(emailTo);
            expect(message.Message.Body.Html.Data).toBeDefined();
            expect(message.Message.Body.Html.Data.includes(uploadLocation)).toBeTruthy();
            expect(message.Message.Subject.Data).toBe(`🦆 Chaos has been invoked in ${environment}!`);
            expect(message.Source).toBe(emailFrom);
            done();
        });

        it('should throw InvalidNotificationMethod if an invalid method is provided', (done) => {
            const notification = new Notification();
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';
            const method = faker.random.word();

            try {
                notification['buildMessage'](method, stopRandomTask, environment, uploadLocation);
            } catch (error) {
                expect(error.stack).toBeDefined();
                expect(error.message).toBe(`Invalid notification method: ${method}`);
            }

            done();
        });
    });

    describe('send', () => {
        afterEach(() => {
            delete process.env.SLACK_WEBHOOK_URL;
            delete process.env.EMAIL_FROM;
            delete process.env.EMAIL_TO;
        });

        it('should not attempt to send a message if notifications are not enabled', (done) => {
            const notification = new Notification();
            const buildMessage = sinon.spy(notification, 'buildMessage');
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';
            const slack = sinon.spy(notification, 'slack', ['get']);

            notification.send(stopRandomTask, environment, uploadLocation);

            expect(notification.enabled).toBeFalsy();
            expect(buildMessage.called).toBeFalsy();
            expect(slack.called).toBeFalsy();
            slack.restore();
            done();
        });

        it('should attempt to send a slack notification', async (done) => {
            process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/ABCDE/FGHIJKLMO/290348unfkje234';
            const notification = new Notification();
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';
            const buildMessage = sinon.spy(notification, 'buildMessage');
            notification.send = sinon.stub().callsFake(async () => {
                notification['enabled'] = true;
                await notification['buildMessage']('slack', stopRandomTask, environment, uploadLocation);
            });

            await notification.send(stopRandomTask, environment, uploadLocation, false);
            expect(notification.enabled).toBeTruthy();
            expect(buildMessage.called).toBeTruthy();
            expect(buildMessage.calledOnceWith('slack', stopRandomTask, environment, uploadLocation)).toBeTruthy();
            buildMessage.restore();
            done();
        });

        it('should attempt to send an email notification', async (done) => {
            const emailFrom = faker.internet.email();
            const emailTo = faker.internet.email();
            process.env.EMAIL_FROM = emailFrom;
            process.env.EMAIL_TO = emailTo;
            const notification = new Notification();
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';
            const buildMessage = sinon.spy(notification, 'buildMessage');
            notification.send = sinon.stub().callsFake(async () => {
                notification['enabled'] = true;
                await notification['buildMessage']('email', stopRandomTask, environment, uploadLocation);
            });

            await notification.send(stopRandomTask, environment, uploadLocation, false);

            expect(notification.enabled).toBeTruthy();
            expect(buildMessage.called).toBeTruthy();
            expect(buildMessage.calledOnceWith('email', stopRandomTask, environment, uploadLocation)).toBeTruthy();
            done();
        });

        it('should attempt to send an email and a slack notification', async (done) => {
            const emailFrom = faker.internet.email();
            const emailTo = faker.internet.email();
            process.env.EMAIL_FROM = emailFrom;
            process.env.EMAIL_TO = emailTo;
            process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/ABCDE/FGHIJKLMO/290348unfkje234';
            const notification = new Notification();
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';
            const buildMessage = sinon.spy(notification, 'buildMessage');

            notification.send = sinon.stub().callsFake(async () => {
                notification['enabled'] = true;
                await notification['buildMessage']('slack', stopRandomTask, environment, uploadLocation);
                await notification['buildMessage']('email', stopRandomTask, environment, uploadLocation);
            });

            await notification.send(stopRandomTask, environment, uploadLocation, false);

            expect(notification.enabled).toBeTruthy();
            expect(buildMessage.callCount).toBe(2);
            expect(buildMessage.calledWith('slack', stopRandomTask, environment, uploadLocation)).toBeTruthy();
            expect(buildMessage.calledWith('email', stopRandomTask, environment, uploadLocation)).toBeTruthy();
            done();
        });

        it('should return an error if an invalid webhook url is provided', async (done) => {
            process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/ABCDE/FGHIJKLMO/290348unfkje234';
            const notification = new Notification();
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';

            try {
                await notification.send(stopRandomTask, environment, uploadLocation, false);
            } catch (error) {
                expect(error.message).toBe('Error: Error: Request failed with status code 404');
            }

            done();
        });
    });
});
