const { spawn } = require('child_process');
const colors = require('colors');

/**
 * @description Calls undeploy series in gulpfile to remove stack from AWS account
 * @param {any} cmd
 */
export const undeploy = (cmd: any) => {
    let alias: string;
    let account: string;
    let role: string;
    let profile: string;
    let stage: string;
    const config = cmd.config || 'duck.json';

    try {
        if (cmd.account && cmd.role) {
            alias = cmd.alias;
            account = cmd.account;
            role = cmd.role;
            profile = cmd.profile || 'default';
            stage = cmd.stage || 'dev';
        } else {
            const conf = require(`${process.cwd()}/${config}`);
            alias = conf.alias;
            account = conf.account;
            role = conf.role;
            profile = conf.profile || 'default';
            stage = conf.stage || 'dev';
        }

        const undeploy = spawn('./node_modules/.bin/gulp', ['undeploy', '-LL', `--alias=${alias}`, `--account=${account}`, `--role=${role}`, `--profile=${profile}`, `--stage=${stage}`]);

        undeploy.stdout.on('data', (data: Buffer) => {
            const output = data.toString().replace(/\n$/, '');
            console.log(output);
        });

        undeploy.on('error', (error: any) => {
            console.error(colors.red(error));
        });
    } catch (error) {
        throw new Error(error);
    }
};
