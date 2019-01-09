import * as axios from 'axios';

export class Slack {
    static async post(data: any) {
        const url = process.env.SLACK_WEBHOOK_URL;
        try {
            const request = axios.default.post(url, { text: data }, { headers: 'application/json' });
            await request;
        } catch (error) {
            throw new Error(error);
        }
    }
}
