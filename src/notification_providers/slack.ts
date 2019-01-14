import axios from 'axios';
import { message } from '../decorators/slackMessage';

export const standardFields = ['Chaos Function', 'Environment'];
export const template = {
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

/**
 * @todo Message templates need to be based on chaosFunction and not service
 * @description This is the main interface for building and posting slack messages
 */
export class Slack {
    private _default = template;
    private _ec2;
    private _ecs;
    private _elasticache;

    constructor() {}

    private get default() {
        return this._default;
    }

    @message([...standardFields, 'Instance', 'Previous State', 'Current State'])
    private get ec2() {
        return this._ec2;
    }

    @message([...standardFields, 'Cluster', 'Task Definition', 'Task'])
    private get ecs() {
        return this._ecs;
    }

    @message([...standardFields, 'Description', 'Replication Group ID'])
    private get elasticache() {
        return this._elasticache;
    }

    buildMessage(data: any, environment?: string) {
        switch (data.service) {
            case 'ec2':
                this.ec2.attachments[0].title = 'The affected service is: EC2';
                this.ec2.attachments[0].fields.forEach((field: { title: string; value: string; short: boolean }) => {
                    switch (field.title) {
                        case 'Chaos Function':
                            field.value = data.action;
                            break;
                        case 'Environment':
                            field.value = environment;
                            break;
                        case 'Instance':
                            field.value = data.result.StoppingInstances[0].InstanceId;
                            break;
                        case 'Previous State':
                            field.value = data.result.StoppingInstances[0].PreviousState;
                            break;
                        case 'Current State':
                            field.value = data.result.StoppingInstances[0].CurrentState;
                            break;
                    }
                });
                return this.ec2;
            case 'ecs':
                this.ecs.attachments[0].title = 'The affected service is: ECS';
                this.ecs.attachments[0].fields.forEach((field: { title: string; value: string; short: boolean }) => {
                    switch (field.title) {
                        case 'Chaos Function':
                            field.value = data.action;
                            break;
                        case 'Environment':
                            field.value = environment;
                            break;
                        case 'Cluster':
                            field.value = data.result.task.clusterArn;
                            break;
                        case 'Task Definition':
                            field.value = data.result.task.taskDefinitionArn;
                            break;
                        case 'Task':
                            field.value = data.result.task.taskArn;
                            break;
                    }
                });
                return this.ecs;
            case 'elasticache':
                this.elasticache.attachments[0].title = 'The affected service is: ElastiCache';
                this.elasticache.attachments[0].fields.forEach((field: { title: string; value: string; short: boolean }) => {
                    switch (field.title) {
                        case 'Chaos Function':
                            field.value = data.action;
                            break;
                        case 'Environment':
                            field.value = environment;
                            break;
                        case 'Description':
                            field.value = data.result.ReplicationGroup.Description;
                            break;
                        case 'Replication Group ID':
                            field.value = data.result.ReplicationGroup.ReplicationGroupId;
                            break;
                    }
                });
                return this.elasticache;
            default:
                this.default.attachments[0].title = `Unable to match service: ${data.service}`;
                this.default.attachments[0].color = '#FF0000';
                return this._default;
        }
    }

    async post(data: any) {
        const url = process.env.SLACK_WEBHOOK_URL;
        try {
            const request = axios.post(url, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
            await request;
        } catch (error) {
            throw new Error(error);
        }
    }
}
