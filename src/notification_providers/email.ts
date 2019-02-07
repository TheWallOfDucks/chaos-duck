import { SES } from '../services/ses';
import { InvalidEmail, InvalidUrl } from '../classes/errors';
import { SES as sdk } from 'aws-sdk';
import { Utility } from '../classes/utility';

/**
 * @description This is the main interface for building and sending email messages
 */
export class Email extends SES {
    constructor() {
        super();
    }

    buildMessage(environment: string, uploadLocation: string) {
        const emailFrom = process.env.EMAIL_FROM;
        const emailTo = process.env.EMAIL_TO;

        if (!Utility.validateEmail(emailFrom)) throw new InvalidEmail(`${emailFrom} is not a valid email`);
        if (!Utility.validateEmail(emailTo)) throw new InvalidEmail(`${emailTo} is not a valid email`);
        if (!Utility.validateUrl(uploadLocation)) throw new InvalidUrl(`${uploadLocation} is not a valid url`);

        const message: sdk.SendEmailRequest = {
            Destination: {
                ToAddresses: [emailTo],
            },
            Message: {
                Body: {
                    Html: {
                        Data: `<a class=\"ulink\" href=\"${uploadLocation}\" target=\"_blank\">Click here to view results</a>`,
                    },
                },
                Subject: {
                    Data: `🦆 Chaos has been invoked in ${environment}!`,
                },
            },
            Source: emailFrom,
        };

        return message;
    }

    async send(message: any) {
        try {
            return await this.sendEmail(message);
        } catch (error) {
            throw new Error(error);
        }
    }
}
