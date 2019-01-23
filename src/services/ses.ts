import { SES as sdk } from 'aws-sdk';

export class SES {
    private ses: sdk;

    constructor() {
        this.ses = new sdk();
    }

    async sendEmail(message: any) {
        try {
            const sendEmail = this.ses.sendEmail(message).promise();
            return await sendEmail;
        } catch (error) {
            throw new Error(error);
        }
    }
}
