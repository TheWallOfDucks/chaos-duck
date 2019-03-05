import { Slack } from '../../../src/notification_providers/slack';
import { stopRandomTask } from '../../helpers/mocks/ecs/stopRandomTask';
import { Utility } from '../../../src/classes/utility';
import * as faker from 'faker';
const sinon = require('sinon');

describe('slack', () => {
    const slack = new Slack();
    let message;

    describe('buildMessage', () => {
        it('should have a default template', () => {
            expect(slack.template).toBeDefined();
        });

        it('should build a slack message using the default template', (done) => {
            const service = Utility.getServiceByValue(stopRandomTask.service);
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';

            message = slack.buildMessage(stopRandomTask, environment, uploadLocation);
            expect(message).toBe(slack.template);
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

        it('should allow for the default template to be overridden', (done) => {
            const service = Utility.getServiceByValue(stopRandomTask.service);
            const environment = faker.random.word();
            const uploadLocation = 'https://www.google.com';
            slack.template = {
                attachments: [
                    {
                        fallback: 'Chaos Duck template has been modified',
                        color: '#36a64f',
                        pretext: 'Beware of the almighty Chaos Duck',
                        author_name: 'Chaos Duck',
                        author_icon: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/apple/155/duck_1f986.png',
                        title: '',
                        text: 'Please kneel before your leader',
                        fields: [],
                        actions: [],
                    },
                ],
            };

            const updatedMessage = slack.buildMessage(stopRandomTask, environment, uploadLocation);
            expect(updatedMessage).toBe(slack.template);
            expect(updatedMessage.attachments[0].fallback).toBe('Chaos Duck template has been modified');
            expect(updatedMessage.attachments[0].pretext).toBe('Beware of the almighty Chaos Duck');
            expect(updatedMessage.attachments[0].author_name).toBe('Chaos Duck');
            expect(updatedMessage.attachments[0].title).toBe(`The chosen service is: ${service}`);
            expect(updatedMessage.attachments[0].text).toBe('Please kneel before your leader');
            done();
        });
    });

    describe('send', () => {
        it('should send a slack', async (done) => {
            const send = sinon.stub(slack, 'send').returns({});
            process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/ABCDE/FGHIJKLMO/290348unfkje234';

            const response = await slack.send(message);
            expect(response).toBeDefined();
            send.restore();
            done();
        });

        it('should throw InvalidUrl if webhook url is invalid', async (done) => {
            process.env.SLACK_WEBHOOK_URL = '🦆 ';

            try {
                await slack.send(message);
            } catch (error) {
                expect(error.stack).toBeDefined();
                expect(error.message).toBe(`${process.env.SLACK_WEBHOOK_URL} is not a valid url`);
            }

            done();
        });

        it('should handle generic errors', async (done) => {
            process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/ABCDE/FGHIJKLMO/290348unfkje234';
            const send = sinon.stub(slack, 'send').throws(new Error('error'));
            try {
                await slack.send(message);
            } catch (error) {
                expect(error.stack).toBeDefined();
                expect(error.message).toBe('error');
                send.restore();
            }

            done();
        });
    });
});
