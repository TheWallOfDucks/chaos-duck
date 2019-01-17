import { Utility } from '../classes/utility';

const fs = require('fs');

const account = {
    type: 'input',
    name: 'account',
    message: 'What is your AWS account number?',
    validate: (account: string) => {
        if (account === '') {
            return 'Please enter your AWS account number';
        }
        if (account.length !== 12) {
            return 'Your AWS account number should be 12 digits';
        }
        if (!Utility.validateNumber(account)) {
            return 'Your AWS account number should be a valid number';
        }
        return account !== '';
    },
};

const environment = {
    type: 'input',
    name: 'environment',
    message: 'What is the name of your AWS environment?',
    validate: (environment: string) => {
        if (environment === '') {
            return 'Please enter the name of your AWS environment';
        }
        return environment !== '';
    },
};

const profile = {
    type: 'input',
    name: 'profile',
    message: 'What is the profile you are using to assume the role?',
    default: () => {
        return 'default';
    },
};

const role = {
    type: 'input',
    name: 'role',
    message: 'What is your AWS role to assume?',
    validate: (role: string) => {
        if (role === '') {
            return 'Please enter the AWS role to assume';
        }
        return role !== '';
    },
};

const schedule = {
    type: 'input',
    name: 'schedule',
    message: 'Please enter the desired schedule for Chaos Duck:',
    when: (answers) => {
        return answers.setSchedule;
    },
    default: () => {
        return '1 hour';
    },
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
};

const services = {
    type: 'input',
    name: 'services',
    message: 'Please enter the services you would like to unleash Chaos Duck on:',
    default: () => {
        return 'ECS, EC2, ElastiCache, RDS';
    },
};

const setSchedule = {
    type: 'confirm',
    name: 'setSchedule',
    message: 'Would you like to run Chaos Duck on a regular schedule?',
};

const slack = {
    type: 'confirm',
    name: 'slack',
    message: 'Do you have a Slack webhook url you would like Chaos Duck to post to?',
};

const slackWebhookUrl = {
    type: 'input',
    name: 'slackWebhookUrl',
    message: 'Please enter your Slack webhook url:',
    when: (answers) => {
        return answers.slack;
    },
};

const stage = {
    type: 'input',
    name: 'stage',
    message: 'What stage do you want to deploy Chaos Duck in?',
    default: () => {
        return 'dev';
    },
};

export const prompts = [environment, account, role, profile, stage, slack, slackWebhookUrl, setSchedule, schedule, services];
