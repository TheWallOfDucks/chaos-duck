import { Slack } from './slack';

export class Notification {
    private _enabled: boolean;
    private _method: string;

    constructor() {
        if (process.env.SLACK_WEBHOOK_URL) {
            this.enabled = true;
            this.method = 'slack';
        }
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }

    private buildMessage(data, environment?: string) {
        switch (this.method) {
            case 'slack':
                return this.slack.buildMessage(data, environment);
            default:
                return 'Unknown notification method';
        }
    }

    private get method() {
        return this._method;
    }

    private set method(value: string) {
        this._method = value;
    }

    private get slack() {
        const slack = new Slack();
        return slack;
    }

    async send(data: any, environment?: string) {
        if (this.enabled) {
            const message = this.buildMessage(data, environment);
            return await this[this.method]['post'](message);
        }
    }
}
