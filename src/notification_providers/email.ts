const Message = require('email-templates');
const nodemailer = require('nodemailer');

// @todo DOTENV is messing with this when it is deployed to lambda. Need to figure out a better way
export class Email {
    constructor() {}

    private get transporter() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async send(data: any) {
        try {
            const emailAddress = process.env.EMAIL_ADDRESS;
            const attachmentName = `chaos-duck-${data.service}-${data.action}-${Date.now()}`;

            const message = new Message({
                send: true,
                message: {
                    from: process.env.EMAIL_USER,
                },
                transport: this.transporter,
            });

            return await message.send({
                template: `${process.cwd()}/src/config/emails/duck`,
                message: {
                    to: emailAddress || 'chaosduck@apitureqa.com',
                    attachments: [
                        {
                            filename: attachmentName,
                            content: JSON.stringify(data, null, 2),
                        },
                    ],
                },
                locals: {
                    data,
                    attachmentName,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
