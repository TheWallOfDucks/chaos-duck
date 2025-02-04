#!/usr/bin/env node
/**
 * @description This file contains all of the CLI bindings for chaos-duck
 */
import * as duck from 'commander';
import { IDuckConfig } from './IDuckConfig';
import { prompts } from './config';
import { deploy } from './deploy';
import { invoke } from './invoke';
import { undeploy } from './undeploy';

const colors = require('colors');
const fs = require('fs');
const inquirer = require('inquirer');
const info = require(`${process.cwd()}/package.json`);

duck.version(info.version, '--version').description('Chaos Duck 🦆');

/**
 * @description Config command
 */
duck.command('config')
    .alias('c')
    .option('-v, --view', 'View your duck.json config file')
    .description('Setup Chaos Duck')
    .action((cmd) => {
        try {
            if (cmd.view) {
                const config = require(`${process.cwd()}/duck.json`);
                console.log(JSON.stringify(config, null, 2));
            } else {
                inquirer.prompt(prompts).then((config) => {
                    const duckConfig: IDuckConfig = {
                        account: config.account,
                        emailFrom: config.emailFrom,
                        emailTo: config.emailTo,
                        alias: config.alias,
                        profile: config.profile,
                        role: config.role,
                        schedule: config.schedule,
                        services: config.services.replace(/\s+/g, ''),
                        slackWebhookUrl: config.slackWebhookUrl,
                        stage: config.stage,
                    };
                    fs.writeFileSync(`${process.cwd()}/duck.json`, JSON.stringify(duckConfig, null, 4));
                    console.log(colors.green(`Wrote your duck.json file to ${process.cwd()}/duck.json 🦆`));
                });
            }
        } catch (error) {
            console.error(colors.red(error));
        }
    });

/**
 * @description Deploy command
 */
duck.command('deploy')
    .alias('d')
    .option('-a, --account <account>', 'AWS account number')
    .option('-al, --alias <alias>', 'Name of AWS account')
    .option('-c, --config <config>', 'If specified, will use options defined in json file provided')
    .option('--emailFrom <emailFrom>', 'The email to send notifications from')
    .option('--emailTo <emailTo>', 'The email to send notifications to')
    .option('-i, --schedule <schedule>', 'The rate at which to schedule Chaos Duck to run')
    .option('-p, --profile <profile>', 'AWS profile')
    .option('-r, --role <role>', 'AWS role')
    .option('-s, --stage <stage>', 'AWS deployment stage')
    .option('--slackWebhookUrl <slackWebhookUrl>', 'The URL to post slack messages to')
    .description('Deploy Chaos Duck')
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
duck.command('invoke')
    .alias('i')
    .option('-c, --config <config>', 'If specified, will use options defined in json file provided')
    .option('-u, --url <url>', 'URL of chaos endpoint')
    .option('-s, --services <services>', 'Comma separated list of')
    .description('Unleash Chaos Duck')
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
duck.command('undeploy')
    .alias('u')
    .option('-c, --config <config>', 'If specified, will use options defined in json file provided')
    .option('-al, --alias <alias>', 'Name of AWS account')
    .option('-a, --account <account>', 'AWS account number')
    .option('-r, --role <role>', 'AWS role')
    .option('-p, --profile <profile>', 'AWS profile')
    .option('-s, --stage <stage>', 'AWS deployment stage')
    .description('Undeploy Chaos Duck')
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
duck.on('command:duck', () => {
    console.log('🦆');
});

duck.on('command:duckwall', () => {
    console.log('🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆');
    console.log('🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆');
    console.log('🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆');
    console.log('🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆 🦆');
});

/**
 * @description Invalid command handler
 */
duck.on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', duck.args.join(' '));
});

duck.parse(process.argv);
