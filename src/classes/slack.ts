import axios from 'axios';

export class Slack {
    static buildMessage(data: any, environment?: string) {
        let body;
        const template = {
            attachments: [
                {
                    fallback: 'Chaos Duck has been unleashed',
                    color: '#36a64f',
                    pretext: 'Chaos Duck has been unleashed',
                    author_name: 'Chaos Duck',
                    author_icon: 'https://vignette.wikia.nocookie.net/pokemon/images/e/ef/Psyduck_Confusion.png/revision/latest?cb=20150611192544',
                    title: '',
                    text: 'Please see information about the chaos below:',
                    fields: [],
                    footer: 'Slack API',
                    footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
                    ts: Math.round(new Date().getTime() / 1000),
                },
            ],
        };

        switch (data.service) {
            case 'ECS':
                body = data.result;
                template.attachments[0].title = 'ECS';
                template.attachments[0].fields = [
                    {
                        title: 'Cluster',
                        value: body.task.clusterArn,
                        short: false,
                    },
                    {
                        title: 'Task Definition',
                        value: body.task.taskDefinitionArn,
                        short: false,
                    },
                    {
                        title: 'Task',
                        value: body.task.taskArn,
                        short: false,
                    },
                ];
                break;
            case 'ElastiCache':
                body = data.result;
                template.attachments[0].title = 'ElastiCache';
                template.attachments[0].fields = [
                    {
                        title: 'Description',
                        value: body.ReplicationGroup.Description,
                        short: false,
                    },
                    {
                        title: 'ReplicationGroupId',
                        value: body.ReplicationGroup.ReplicationGroupId,
                        short: false,
                    },
                ];
                break;
            default:
                return `Could not match ${data.service}`;
        }

        if (environment) {
            template.attachments[0].fields.unshift({
                title: 'Environment',
                value: environment,
                short: false,
            });
        }
        return JSON.stringify(template);
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
