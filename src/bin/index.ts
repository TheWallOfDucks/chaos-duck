#!/usr/bin/env node
/**
 * @description This file contains all of the CLI bindings for chaos-duck
 */
import * as commander from 'commander';
import { IDuckConfig } from './IDuckConfig';
import { prompts } from './config';
import { deploy } from './deploy';
import { invoke } from './invoke';
import { undeploy } from './undeploy';

const colors = require('colors');
const fs = require('fs');
const inquirer = require('inquirer');
const info = require('../../package.json');

commander.version(info.version, '-v, --version').description('Chaos Duck \uD83E\uDD86');

/**
 * @description Config command
 */
commander
    .command('config')
    .alias('c')
    .description('Setup Chaos Duck')
    .action(() => {
        try {
            inquirer.prompt(prompts).then((config) => {
                const duckConfig: IDuckConfig = {
                    environment: config.environment,
                    account: config.account,
                    role: config.role,
                    profile: config.profile,
                    stage: config.stage,
                    slackWebhookUrl: config.slackWebhookUrl,
                    schedule: config.schedule,
                    services: config.services.replace(/\s+/g, ''),
                };
                fs.writeFileSync(`${process.cwd()}/duck.json`, JSON.stringify(duckConfig, null, 4));
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
        try {
            await deploy(cmd);
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
            const response = await invoke(cmd);
            console.log(JSON.stringify(response, null, 2));
        } catch (error) {
            console.error(colors.red(error));
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
        try {
            await undeploy(cmd);
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
