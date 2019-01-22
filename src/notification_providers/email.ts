import { SES } from '../services/ses';

export class Email extends SES {
    constructor() {
        super();
    }

    async send(data: any) {
        try {
            const emailFrom = process.env.EMAIL_FROM;
            const emailTo = process.env.EMAIL_TO;
            return await this.sendEmail(emailFrom, emailTo, data);
        } catch (error) {
            throw new Error(error);
        }
    }
}
