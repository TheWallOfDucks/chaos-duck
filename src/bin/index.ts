#!/usr/bin/env node
import * as commander from 'commander';

const { execSync } = require('child_process');
const fs = require('fs');
const info = require('../../package.json');

commander.version(info.version, '-v, --version').description('Chaos Duck');

commander
    .command('deploy')
    .alias('d')
    .option('-c, --config <config>', 'If true, will use options defined in json file specified')
    .option('-e, --environment <environment>', 'Name of AWS environment')
    .option('-a, --account <account>', 'AWS account number')
    .option('-r, --role <role>', 'AWS role')
    .option('-p, --profile <profile>', 'AWS profile')
    .option('-s, --stage <stage>', 'AWS deployment stage')
    .description('Deploys Chaos Duck based on provided options')
    .allowUnknownOption()
    .action(async (cmd) => {
        let environment;
        let account;
        let role;
        let profile;
        let stage;
        const config = cmd.config;

        if (config) {
            const conf = require(`${process.cwd()}/${config}`);
            environment = conf.environment;
            account = conf.account;
            role = conf.role;
            profile = conf.profile;
            stage = conf.stage;
        } else {
            environment = cmd.environment;
            account = cmd.account;
            role = cmd.role;
            profile = cmd.profile;
            stage = cmd.stage;
        }

        const result: Buffer = execSync(`gradle deploy -Daws_env=${environment} -Daws_account=${account} -Daws_role=${role} -Daws_profile=${profile} -Daws_stage=${stage}`);
        console.log(result.toString());
    });

commander.parse(process.argv);
