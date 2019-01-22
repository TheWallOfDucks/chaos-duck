import { Slack } from '../notification_providers/slack';
import { Email } from '../notification_providers/email';

/**
 * @description Notification class is the main interface to deliver notifications to different channels.
 * All notification providers should be given their own, lowercase, getter.
 * All notification provider classes should expose a method called "send".
 */
export class Notification {
    private _enabled: boolean;
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

    get email() {
        return new Email();
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }

    private buildMessage(method, data, environment?: string) {
        switch (method) {
            case 'slack':
                return this.slack.buildMessage(data, environment);
            case 'email':
                data['environment'] = environment;
                return data;
            default:
                return 'Unknown notification method';
        }
    }

    private get slack() {
        return new Slack();
    }

    async send(data: any, environment?: string) {
        if (this.enabled) {
            try {
                for (let i = 0; i < this.methods.length; i++) {
                    const message = this.buildMessage(this.methods[i], data, environment);
                    console.log('Message: ', message);
                    await this[this.methods[i]]['send'](message);
                }
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}
