const email = require('email-templates');
const path = require('path');
// const templates = path.join(__dirname, 'emails')

export class Email {
    constructor() {}

    async send(data: any) {
        const emailAddress = process.env.EMAIL;

        const message = new email({
            message: {
                from: 'chaos.duck@apiture.com',
            },
            transport: {
                jsonTransport: true,
            },
        });

        const test = await message.send({
            template: `${process.cwd()}/src/notification_providers/emails/duck`,
            message: {
                to: 'elon@spacex.com',
            },
            locals: {
                data: JSON.stringify(data, null, 2),
            },
        });

        return test;
    }
}
