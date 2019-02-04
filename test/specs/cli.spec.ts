import * as faker from 'faker';
const cmd = require('../helpers/cmd');
const { ENTER } = require('../helpers/cmd');
import { getRandomNumber } from '../helpers/generateRandomNumber';

const { spawnSync } = require('child_process');
const info = require('../../../package.json');

describe('chaos-duck', () => {
    describe('--version', () => {
        it('should return the correct version', (done) => {
            try {
                const command = spawnSync('node', ['lib/src/bin/index.js', '--version']);
                const version = command.stdout.toString().trim();
                expect(version).toBe(info.version);
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
                    account: getRandomNumber(12),
                    environment: faker.random.word(),
                    profile: 'default',
                    role: faker.random.word(),
                    stage: faker.random.word(),
                    schedule: 'No',
                    notifications: 'No',
                    services: 'ECS',
                };
                await cmd.executeWithInput(
                    'lib/src/bin/index.js',
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

                const config = require('../../../duck.json');
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
