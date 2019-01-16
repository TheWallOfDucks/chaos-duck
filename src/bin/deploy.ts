import { Utility } from '../classes/utility';
import { DuckConfig } from './IDuckConfig';

const colors = require('colors');
const fs = require('fs');
const { spawn } = require('child_process');

export const deploy = async (cmd: any) => {
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

        const deploy = spawn('./node_modules/.bin/gulp', ['deploy', '-LL', `--environment=${environment}`, `--account=${account}`, `--role=${role}`, `--profile=${profile}`, `--stage=${stage}`]);

        deploy.stdout.on('data', (data: Buffer) => {
            const output = data.toString().replace(/\n$/, '');
            if (output.includes('endpoints')) {
                chaosUrl = output
                    .split(' ')
                    .pop()
                    .trim();
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
        throw new Error(error);
    }
};
