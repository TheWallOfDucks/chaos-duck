import { Slack } from '../notification_providers/slack';
import { Email } from '../notification_providers/email';
import { InvalidNotificationMethod } from './errors';

/**
 * @description Notification class is the main interface to deliver notifications to different channels.
 * All notification providers should be given their own, lowercase, getter.
 * All notification provider classes should expose a method called "send".
 */
export class Notification {
    private _enabled: boolean = false;
    private methods: string[] = [];

    constructor() {
        if (process.env.SLACK_WEBHOOK_URL && process.env.SLACK_WEBHOOK_URL !== 'undefined') {
            this.enabled = true;
            this.methods.push('slack');
        }
        if (process.env.EMAIL_FROM && process.env.EMAIL_FROM !== 'undefined') {
            if (process.env.EMAIL_TO && process.env.EMAIL_TO !== 'undefined') {
                this.enabled = true;
                this.methods.push('email');
            }
        }
    }

    private get email() {
        return new Email();
    }

    private get enabled() {
        return this._enabled;
    }

    private set enabled(value: boolean) {
        this._enabled = value;
    }

    buildMessage(method, data, environment?: string, uploadLocation?: string) {
        switch (method) {
            case 'slack':
                return this.slack.buildMessage(data, environment, uploadLocation);
            case 'email':
                data['environment'] = environment;
                return this.email.buildMessage(environment, uploadLocation);
            default:
                throw new InvalidNotificationMethod(`Invalid notification method: ${method}`);
        }
    }

    private get slack() {
        return new Slack();
    }

    async send(data: any, environment?: string, uploadLocation?: string, log = true) {
        if (this.enabled) {
            try {
                for (let i = 0; i < this.methods.length; i++) {
                    const message = this.buildMessage(this.methods[i], data, environment, uploadLocation);
                    if (log) {
                        console.log('Message: ', JSON.stringify(message, null, 2));
                    }
                    await this[this.methods[i]]['send'](message);
                }
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}
