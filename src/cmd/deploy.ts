import { Utility } from '../classes/utility';
import { IDuckConfig } from './IDuckConfig';

const colors = require('colors');
const fs = require('fs');
const { spawn } = require('child_process');

export const deploy = async (cmd: any) => {
    let account: string;
    let chaosUrl: string;
    let emailFrom: string;
    let emailTo: string;
    let alias: string;
    let profile: string;
    let role: string;
    let schedule: string;
    let services: string;
    let slackWebhookUrl: string;
    let stage: string;
    const config = cmd.config || 'duck.json';

    try {
        if (cmd.account && cmd.role) {
            account = cmd.account;
            emailFrom = cmd.emailFrom;
            emailTo = cmd.emailTo;
            alias = cmd.alias;
            profile = cmd.profile || 'default';
            role = cmd.role;
            schedule = cmd.schedule;
            services = cmd.services;
            slackWebhookUrl = cmd.slackWebhookUrl;
            stage = cmd.stage || 'dev';
        } else {
            const conf: IDuckConfig = require(`${process.cwd()}/${config}`);
            account = conf.account;
            emailFrom = conf.emailFrom;
            emailTo = conf.emailTo;
            alias = conf.alias;
            profile = conf.profile || 'default';
            role = conf.role;
            schedule = conf.schedule;
            services = conf.services;
            slackWebhookUrl = conf.slackWebhookUrl;
            stage = conf.stage || 'dev';
        }

        // Set for serverless
        process.env.SLACK_WEBHOOK_URL = slackWebhookUrl;
        process.env.SERVICES = services;
        process.env.EMAIL_FROM = emailFrom;
        process.env.EMAIL_TO = emailTo;

        // Validate schedule
        if (schedule) {
            const validSchedule = Utility.validateSchedule(schedule);
            if (validSchedule) {
                process.env.RATE = schedule;
            }
        }

        const deploy = spawn('./node_modules/.bin/gulp', ['deploy', '-LL', `--alias=${alias}`, `--account=${account}`, `--role=${role}`, `--profile=${profile}`, `--stage=${stage}`]);

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
                const body: IDuckConfig = {
                    account,
                    chaosUrl,
                    emailFrom,
                    emailTo,
                    alias,
                    profile,
                    role,
                    schedule,
                    services,
                    slackWebhookUrl,
                    stage,
                };

                fs.writeFileSync(`${process.cwd()}/duck.json`, JSON.stringify(body, null, 4));
                console.log(colors.green(`Wrote your duck.json file to ${process.cwd()}/duck.json 🦆`));
            }
        });

        deploy.on('error', (error: any) => {
            console.error(colors.red(error));
        });
    } catch (error) {
        throw new Error(error);
    }
};
