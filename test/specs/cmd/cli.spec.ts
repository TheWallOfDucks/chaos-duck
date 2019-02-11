import * as faker from 'faker';
import { Utility } from '../../../src/classes/utility';

import { executeWithInput, ENTER } from '../../helpers/cmd';
const info = require('../../../../package.json');

describe('chaos-duck', () => {
    beforeAll(() => {
        delete process.env.SLACK_WEBHOOK_URL;
        delete process.env.EMAIL_TO;
        delete process.env.EMAIL_FROM;
    });

    describe('--version', () => {
        it('should return the correct version', async (done) => {
            try {
                const version = await executeWithInput('lib/src/cmd/index.js', ['--version']);
                expect(version.trim()).toBe(info.version);
            } catch (error) {
                fail(error);
            }

            done();
        });
    });

    describe('config', () => {
        it('should create a duck.json file with supplied information', async (done) => {
            try {
                const answers = {
                    account: '012345678912',
                    environment: faker.random.word(),
                    profile: 'default',
                    role: faker.random.word(),
                    stage: faker.random.word(),
                    schedule: 'No',
                    notifications: 'No',
                    services: 'ECS',
                };
                await executeWithInput(
                    'lib/src/cmd/index.js',
                    ['config'],
                    [
                        answers.role,
                        ENTER,
                        answers.account,
                        ENTER,
                        answers.profile,
                        ENTER,
                        answers.environment,
                        ENTER,
                        answers.stage,
                        ENTER,
                        answers.notifications,
                        ENTER,
                        answers.schedule,
                        ENTER,
                        answers.services,
                        ENTER,
                    ],
                );

                const config = require('../../../../duck.json');
                expect(config.account).toBe(answers.account);
                expect(config.environment).toBe(answers.environment);
                expect(config.profile).toBe(answers.profile);
                expect(config.role).toBe(answers.role);
                expect(config.services).toBe(answers.services);
                expect(config.stage).toBe(answers.stage);
            } catch (error) {
                fail(error);
            }

            done();
        }, 10000);
    });
});
