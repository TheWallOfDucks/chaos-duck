import axios, { AxiosPromise } from 'axios';
import { Utility } from '../classes/utility';
import { InvalidUrl } from '../classes/errors';
import { IChaosResponse } from '../classes/chaos';

/**
 * @description This is the main interface for building and posting slack messages
 */
export class Slack {
    private _template;

    constructor() {
        this.template = {
            attachments: [
                {
                    fallback: 'Chaos Duck has been unleashed',
                    color: '#36a64f',
                    pretext: 'Chaos Duck has been unleashed',
                    author_name: 'Chaos Duck',
                    author_icon: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/apple/155/duck_1f986.png',
                    title: '',
                    text: 'Please see information about the chaos below:',
                    fields: [],
                    actions: [],
                },
            ],
        };
    }

    get template() {
        return this._template;
    }

    set template(value: any) {
        this._template = value;
    }

    /**
     * @description Builds a message to send through slack
     * @param {IChaosResponse} data
     * @param {string} environment
     * @param {string} uploadLocation
     * @returns any
     */
    buildMessage(data: IChaosResponse, environment: string, uploadLocation: string): any {
        const service = Utility.getServiceByValue(data.service);
        this.template.attachments[0].title = `The chosen service is: ${service}`;
        this.template.attachments[0].fields = [
            {
                title: 'Chaos Function',
                value: data.action,
                short: false,
            },
            {
                title: 'Environment',
                value: environment,
                short: false,
            },
        ];
        this.template.attachments[0].actions = [
            {
                type: 'button',
                name: 'view_results',
                text: 'View Results',
                url: uploadLocation,
                style: 'primary',
            },
        ];

        return this.template;
    }

    /**
     * @description Sends a slack
     * @param {any} data
     * @returns {any} promise
     */
    async send(data: any) {
        const url = process.env.SLACK_WEBHOOK_URL;
        if (!Utility.validateUrl(url)) throw new InvalidUrl(`${url} is not a valid url`);

        try {
            const request = axios.post(url, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
            await request;
        } catch (error) {
            throw new Error(error);
        }
    }
}
