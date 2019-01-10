import axios from 'axios';

export class Slack {
    static buildMessage(data, environment: string = 'open-sandbox') {
        let body;
        const template = {
            attachments: [
                {
                    fallback: 'Required plain-text summary of the attachment.',
                    color: '#36a64f',
                    pretext: 'Chaos Duck has been unleashed',
                    author_name: 'Chaos Duck',
                    author_link: '',
                    author_icon: 'https://vignette.wikia.nocookie.net/pokemon/images/e/ef/Psyduck_Confusion.png/revision/latest?cb=20150611192544',
                    title: '',
                    title_link: '',
                    text: 'Please see information about the chaos below:',
                    fields: [],
                    image_url: 'http://my-website.com/path/to/image.jpg',
                    thumb_url: 'http://example.com/path/to/thumb.png',
                    footer: 'Slack API',
                    footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
                    ts: 123456789,
                },
            ],
        };

        switch (data.service) {
            case 'ECS':
                body = data.result;
                template.attachments[0].title = 'ECS';
                template.attachments[0].fields = [
                    {
                        title: 'Environment',
                        value: environment,
                        short: false,
                    },
                    {
                        title: 'Cluster',
                        value: body.task.clusterArn,
                        short: false,
                    },
                    {
                        title: 'Task',
                        value: body.task.taskDefinitionArn,
                        short: false,
                    },
                ];
                return JSON.stringify(template);
            case 'ElastiCache':
                body = data.result;
                template.attachments[0].title = 'ElastiCache';
                template.attachments[0].fields = [
                    {
                        title: 'Environment',
                        value: environment,
                        short: false,
                    },
                    {
                        title: 'Cluster',
                        value: body.task.clusterArn,
                        short: false,
                    },
                    {
                        title: 'Task',
                        value: body.task.taskDefinitionArn,
                        short: false,
                    },
                ];
                return JSON.stringify(template);
            default:
                return `Could not match ${data.service}`;
        }
    }

    static enabled() {
        if (process.env.SLACK_WEBHOOK_URL) {
            return true;
        }
        return false;
    }

    static async post(data: any) {
        const url = process.env.SLACK_WEBHOOK_URL;
        try {
            const request = axios.post(url, data, { headers: { 'Content-Type': 'application/json' } });
            await request;
        } catch (error) {
            console.log('Error in slack:post => ', error);
            console.log('Payload => ', data);
            throw new Error(error);
        }
    }
}
