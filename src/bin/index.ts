#!/usr/bin/env node
import * as commander from 'commander';
import axios from 'axios';

const { spawn } = require('child_process');
const info = require('../../package.json');

commander.version(info.version, '-v, --version').description('Chaos Duck');

commander
    .command('deploy')
    .alias('d')
    .option('-c, --config <config>', 'If specified, will use options defined in json file provided')
    .option('-e, --environment <environment>', 'Name of AWS environment')
    .option('-a, --account <account>', 'AWS account number')
    .option('-r, --role <role>', 'AWS role')
    .option('-p, --profile <profile>', 'AWS profile')
    .option('-s, --stage <stage>', 'AWS deployment stage')
    .description('Deploys Chaos Duck based on provided options')
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
                process.env.SLACK_WEBHOOK_URL = conf.slackWebhookUrl;
            } else {
                environment = cmd.environment;
                account = cmd.account;
                role = cmd.role;
                profile = cmd.profile || 'default';
                stage = cmd.stage || 'dev';
            }

            const deploy = spawn('gradle', ['deploy', `-Daws_env=${environment}`, `-Daws_account=${account}`, `-Daws_role=${role}`, `-Daws_profile=${profile}`, `-Daws_stage=${stage}`]);

            deploy.stdout.on('data', (data: Buffer) => {
                const output = data.toString().replace(/\n$/, '');
                if (output.includes('ServiceEndpoint')) {
                    console.log(`\uD83E\uDD86\uD83E\uDD86 ${output}/chaos \uD83E\uDD86\uD83E\uDD86`);
                } else {
                    console.log(output);
                }
            });

            deploy.on('error', (error: any) => {
                console.error(error);
            });
        } catch (error) {
            console.error(error);
        }
    });

commander
    .command('invoke')
    .alias('i')
    .option('-u, --url <url>', 'URL of chaos endpoint')
    .option('-s, --services <services>', 'Array of services')
    .description('Invokes chaos lambda')
    .allowUnknownOption()
    .action(async (cmd) => {
        try {
            const url = cmd.url;
            const services = cmd.services.split(',');

            const request = axios.post(url, { services });
            const response = await request;

            console.log(JSON.stringify(response.data, null, 2));
        } catch (error) {
            if (error.response) {
                console.log(JSON.stringify(error.response.data));
            } else {
                console.error(error);
            }
        }
    });

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

commander.parse(process.argv);
