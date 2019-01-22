import { Utility } from '../classes/utility';
let config;

// If there is already a config file, return the values from it as default
try {
    config = require('../../duck.json');
} catch (error) {
    config = {};
}

const account = {
    type: 'input',
    name: 'account',
    message: 'What is your AWS account number?',
    default: () => {
        return config.account || '';
    },
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

const emailFrom = {
    type: 'input',
    name: 'emailFrom',
    message: 'Please enter the email address you would like notifications sent from. NOTE - this address must be verified in SES:',
    default: () => {
        return config.emailFrom || '';
    },
    when: (answers) => {
        return answers.notificationProviders.includes('Email');
    },
};

const emailTo = {
    type: 'input',
    name: 'emailTo',
    message: 'Please enter the email address you would like notifications sent to. NOTE - this address must be verified in SES:',
    default: () => {
        return config.emailTo || '';
    },
    when: (answers) => {
        return answers.notificationProviders.includes('Email');
    },
};

const environment = {
    type: 'input',
    name: 'environment',
    message: 'What is the name of your AWS environment?',
    default: () => {
        return config.environment || '';
    },
    validate: (environment: string) => {
        if (environment === '') {
            return 'Please enter the name of your AWS environment';
        }
        return environment !== '';
    },
};

const notifications = {
    type: 'confirm',
    name: 'notifications',
    message: 'Would you like to receive notifications from Chaos Duck?',
};

const notificationProviders = {
    type: 'checkbox',
    name: 'notificationProviders',
    message: 'Select notification types: ',
    when: (answers) => {
        return answers.notifications;
    },
    choices: [
        {
            name: 'Slack',
        },
        {
            name: 'Email',
        },
    ],
};

const profile = {
    type: 'input',
    name: 'profile',
    message: 'What is the profile you are using to assume the role?',
    default: () => {
        return config.profile || 'default';
    },
};

const role = {
    type: 'input',
    name: 'role',
    message: 'What is your AWS role to assume?',
    default: () => {
        return config.role || '';
    },
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
        return config.schedule || '1 hour';
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
        return config.services || 'ECS, EC2, ElastiCache, RDS';
    },
};

const setSchedule = {
    type: 'confirm',
    name: 'setSchedule',
    message: 'Would you like to run Chaos Duck on a regular schedule?',
};

const slackWebhookUrl = {
    type: 'input',
    name: 'slackWebhookUrl',
    message: 'Please enter your Slack webhook url:',
    default: () => {
        return config.slackWebhookUrl || '';
    },
    when: (answers) => {
        return answers.notificationProviders.includes('Slack');
    },
};

const stage = {
    type: 'input',
    name: 'stage',
    message: 'What stage do you want to deploy Chaos Duck in?',
    default: () => {
        return config.stage || 'dev';
    },
};

export const prompts = [environment, account, role, profile, stage, notifications, notificationProviders, slackWebhookUrl, emailFrom, emailTo, setSchedule, schedule, services];
