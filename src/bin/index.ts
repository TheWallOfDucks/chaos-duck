#!/usr/bin/env node
import * as commander from 'commander';
const { execSync } = require('child_process');

const info = require('../../package.json');

commander
    .version(info.version, '-v, --version')
    .description('Chaos Duck')
    .option('-c, --config <config>', 'If true, will use options defined in json file specified');

commander
    .command('deploy')
    .alias('d')
    .option('-e, --environment <environment>', 'Name of AWS environment')
    .option('-a, --account <account>', 'AWS account number')
    .option('-r, --role <role>', 'AWS role')
    .option('-p, --profile <profile>', 'AWS profile')
    .option('-s, --stage <stage>', 'AWS deployment stage')
    .description('Deploys Chaos Duck based on provided options')
    .allowUnknownOption()
    .action(async (cmd) => {
        const environment = cmd.environment;
        const account = cmd.account;
        const role = cmd.role;
        const profile = cmd.profile;
        const stage = cmd.stage;

        console.log('environment => ', environment);
        console.log('account => ', account);
        console.log('role => ', role);
        console.log('profile => ', profile);
        console.log('stage => ', stage);

        const result: Buffer = execSync(`gradle deploy -Daws_env=${environment} -Daws_account=${account} -Daws_role=${role} -Daws_profile=${profile} -Daws_stage=${stage}`);
        console.log(result.toString());
    });

commander.parse(process.argv);
