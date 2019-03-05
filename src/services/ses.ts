import { SES as sdk, AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

export class SES {
    private ses: sdk;

    constructor() {
        this.ses = new sdk();
    }

    /**
     * @description Sends an email
     * @param {sdk.SendEmailRequest} message
     * @returns {sdk.SendEmailResponse}
     */
    async sendEmail(message: sdk.SendEmailRequest): Promise<PromiseResult<sdk.SendEmailResponse, AWSError>> {
        try {
            const sendEmail = this.ses.sendEmail(message).promise();
            return await sendEmail;
        } catch (error) {
            throw new Error(error);
        }
    }
}
