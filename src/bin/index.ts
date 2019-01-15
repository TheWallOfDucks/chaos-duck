#!/usr/bin/env node
/**
 * @description This file contains all of the CLI bindings for chaos-duck
 */
import * as commander from 'commander';
import axios from 'axios';
import { Utility } from '../classes/utility';

const colors = require('colors');
const fs = require('fs');
const { spawn } = require('child_process');
const inquirer = require('inquirer');
const info = require('../../package.json');

interface DuckConfig {
    account: string;
    chaosUrl?: string;
    environment?: string;
    profile?: string;
    role: string;
    schedule?: string;
    services?: string;
    slackWebhookUrl?: string;
    stage?: string;
}

commander.version(info.version, '-v, --version').description('Chaos Duck \uD83E\uDD86');

commander
    .command('config')
    .alias('c')
    .description('Setup Chaos Duck')
    .action(() => {
        try {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'environment',
                        message: 'What is the name of your AWS environment?',
                    },
                    {
                        type: 'input',
                        name: 'account',
                        message: 'What is your AWS account number?',
                    },
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What is your AWS role to assume?',
                    },
                    {
                        type: 'input',
                        name: 'profile',
                        message: 'What is the profile you are using to assume the role?',
                        default: () => {
                            return 'default';
                        },
                    },
                    {
                        type: 'input',
                        name: 'stage',
                        message: 'What stage do you want to deploy Chaos Duck in?',
                        default: () => {
                            return 'dev';
                        },
                    },
                    {
                        type: 'input',
                        name: 'slackWebhookUrl',
                        message: 'If you have a Slack webhook you would like to use, please enter the url',
                        default: () => {
                            return '';
                        },
                    },
                    {
                        type: 'input',
                        name: 'schedule',
                        message: 'If you would like to run Chaos Duck on a scheduled interval, enter it here',
                        validate: (schedule: string) => {
                            try {
                                if (schedule) {
                                    const valid = Utility.validateSchedule(schedule);
                                    if (valid) {
                                        return true;
                                    }
                                    return 'Please enter a valid schedule. Value must be a positive integer and unit must be one of the following: minute(s), hour(s), day(s)';
                                }
                                return true;
                            } catch (error) {
                                return 'Please enter a valid schedule. Value must be a positive integer and unit must be one of the following: minute(s), hour(s), day(s)';
                            }
                        },
                    },
                    {
                        type: 'input',
                        name: 'services',
                        message: 'If you would only like to run Chaos Duck on specific services, specify them here',
                        default: () => {
                            return '';
                        },
                    },
                ])
                .then((answers) => {
                    fs.writeFileSync(`${process.cwd()}/duck.json`, JSON.stringify(answers, null, 4));
                    console.log(colors.green(`Wrote your duck.json file to ${process.cwd()}/duck.json \uD83E\uDD86`));
                });
        } catch (error) {
            console.error(colors.red(error));
        }
    });

/**
 * @description Deploy command
 */
commander
    .command('deploy')
    .alias('d')
    .option('-c, --config <config>', 'If specified, will use options defined in json file provided')
    .option('-e, --environment <environment>', 'Name of AWS environment')
    .option('-a, --account <account>', 'AWS account number')
    .option('-r, --role <role>', 'AWS role')
    .option('-p, --profile <profile>', 'AWS profile')
    .option('-s, --stage <stage>', 'AWS deployment stage')
    .option('-i, --schedule <schedule>', 'The rate at which to schedule Chaos Duck to run')
    .option('--slackWebhookUrl <slackWebhookUrl>', 'The URL to post slack messages to')
    .description('Deploy Chaos Duck')
    .allowUnknownOption()
    .action(async (cmd) => {
        let environment: string;
        let account: string;
        let role: string;
        let profile: string;
        let stage: string;
        let chaosUrl: string;
        let slackWebhookUrl: string;
        let schedule: string;
        const config = cmd.config;

        try {
            if (config) {
                const conf: DuckConfig = require(`${process.cwd()}/${config}`);
                environment = conf.environment;
                account = conf.account;
                role = conf.role;
                profile = conf.profile || 'default';
                stage = conf.stage || 'dev';
                slackWebhookUrl = conf.slackWebhookUrl;
                schedule = conf.schedule;
            } else {
                environment = cmd.environment;
                account = cmd.account;
                role = cmd.role;
                profile = cmd.profile || 'default';
                stage = cmd.stage || 'dev';
                slackWebhookUrl = cmd.slackWebhookUrl;
                schedule = cmd.schedule;
            }

            // Set for serverless
            process.env.SLACK_WEBHOOK_URL = slackWebhookUrl;

            // Validate schedule
            if (schedule) {
                const validSchedule = Utility.validateSchedule(schedule);
                if (validSchedule) {
                    process.env.RATE = schedule;
                }
            }

            const deploy = spawn('gradle', ['deploy', `-Daws_env=${environment}`, `-Daws_account=${account}`, `-Daws_role=${role}`, `-Daws_profile=${profile}`, `-Daws_stage=${stage}`]);

            deploy.stdout.on('data', (data: Buffer) => {
                const output = data.toString().replace(/\n$/, '');
                if (output.includes('ServiceEndpoint')) {
                    chaosUrl = `${output
                        .split(':')
                        .slice(1)
                        .join(':')}/chaos`.trim();
                }
                console.log(output);
            });

            deploy.on('exit', (code: number) => {
                if (code === 0) {
                    const body: DuckConfig = {
                        account,
                        chaosUrl,
                        environment,
                        profile,
                        role,
                        schedule,
                        slackWebhookUrl,
                        stage,
                    };

                    fs.writeFileSync(`${process.cwd()}/duck.json`, JSON.stringify(body, null, 4));
                    console.log(colors.green(`Wrote your duck.json file to ${process.cwd()}/duck.json \uD83E\uDD86`));
                }
            });

            deploy.on('error', (error: any) => {
                console.error(colors.red(error));
            });
        } catch (error) {
            console.error(colors.red(error));
        }
    });

/**
 * @description Invoke command
 */
commander
    .command('invoke')
    .alias('i')
    .option('-c, --config <config>', 'If specified, will use options defined in json file provided')
    .option('-u, --url <url>', 'URL of chaos endpoint')
    .option('-s, --services <services>', 'Comma separated list of')
    .description('Unleash Chaos Duck')
    .allowUnknownOption()
    .action(async (cmd) => {
        try {
            let chaosUrl: string;
            let services: any;
            const config = cmd.config;

            if (config) {
                const conf = require(`${process.cwd()}/${config}`);
                chaosUrl = conf.chaosUrl;
                services = conf.services;
            } else {
                chaosUrl = cmd.url;
                services = cmd.services;
            }

            if (services) {
                services = services.split(',');
                services = { services };
            }

            const request = axios.post(chaosUrl, services);
            const response = await request;

            console.log(JSON.stringify(response.data, null, 2));
        } catch (error) {
            if (error.response) {
                console.log(JSON.stringify(error.response.data));
            } else {
                console.error(colors.red(error));
            }
        }
    });

/**
 * @description Undeploy command
 */
commander
    .command('undeploy')
    .alias('u')
    .option('-c, --config <config>', 'If specified, will use options defined in json file provided')
    .option('-e, --environment <environment>', 'Name of AWS environment')
    .option('-a, --account <account>', 'AWS account number')
    .option('-r, --role <role>', 'AWS role')
    .option('-p, --profile <profile>', 'AWS profile')
    .option('-s, --stage <stage>', 'AWS deployment stage')
    .description('Undeploy Chaos Duck')
    .allowUnknownOption()
    .action(async (cmd) => {
        let environment: string;
        let account: string;
        let role: string;
        let profile: string;
        let stage: string;
        const config = cmd.config;

        try {
            if (config) {
                const conf = require(`${process.cwd()}/${config}`);
                environment = conf.environment;
                account = conf.account;
                role = conf.role;
                profile = conf.profile || 'default';
                stage = conf.stage || 'dev';
            } else {
                environment = cmd.environment;
                account = cmd.account;
                role = cmd.role;
                profile = cmd.profile || 'default';
                stage = cmd.stage || 'dev';
            }

            const deploy = spawn('gradle', ['undeploy', `-Daws_env=${environment}`, `-Daws_account=${account}`, `-Daws_role=${role}`, `-Daws_profile=${profile}`, `-Daws_stage=${stage}`]);

            deploy.stdout.on('data', (data: Buffer) => {
                const output = data.toString().replace(/\n$/, '');
                console.log(output);
            });

            deploy.on('error', (error: any) => {
                console.error(colors.red(error));
            });
        } catch (error) {
            console.error(colors.red(error));
        }
    });

/**
 *@description Custom listeners
 */
commander.on('command:duck', () => {
    console.log('\uD83E\uDD86');
});

commander.on('command:duckwall', () => {
    console.log(
        '\uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86',
    );
    console.log(
        '\uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86',
    );
    console.log(
        '\uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86',
    );
    console.log(
        '\uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86 \uD83E\uDD86',
    );
});

/**
 * @description Invalid command handler
 */
commander.on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', commander.args.join(' '));
});

commander.parse(process.argv);
