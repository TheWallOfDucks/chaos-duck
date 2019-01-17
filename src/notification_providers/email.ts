const email = require('email-templates');
const nodemailer = require('nodemailer');
import { config } from 'dotenv';
config();

export class Email {
    private _account;

    constructor() {}

    private get account() {
        return this._account;
    }

    private set account(value) {
        this._account = value;
    }

    private get transporter() {
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async send(data: any) {
        const emailAddress = process.env.EMAIL;
        const attachmentName = `chaos-duck-${data.service}-${data.action}-${Date.now()}`;

        const message = new email({
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
    }
}
