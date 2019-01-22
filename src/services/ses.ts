import { SES as sdk } from 'aws-sdk';

export class SES {
    private ses: sdk;

    constructor() {
        this.ses = new sdk();
    }

    async sendEmail(emailFrom: string, emailTo: string, response: any) {
        try {
            const message: sdk.SendEmailRequest = {
                Destination: {
                    ToAddresses: [emailTo],
                },
                Message: {
                    Body: {
                        Text: {
                            Data: JSON.stringify(response, null, 2),
                        },
                    },
                    Subject: {
                        Data: `🦆 Chaos has been invoked in ${response.environment}!`,
                    },
                },
                Source: emailFrom,
            };

            const sendEmail = this.ses.sendEmail(message).promise();
            return await sendEmail;
        } catch (error) {
            throw new Error(error);
        }
    }
}
