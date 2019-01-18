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
            author_icon: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/apple/155/duck_1f986.png',
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
 * @todo There has to be a better way to do this...
 * @description This is the main interface for building and posting slack messages
 */
export class Slack {
    private _default = template;
    private _failoverElasticache;
    private _stopRandomEC2Instance;
    private _stopRandomECSTask;
    private _failoverRandomDBCluster;

    constructor() {}

    private get default() {
        return this._default;
    }

    @message([...standardFields, 'Instance', 'Previous State', 'Current State'])
    private get stopRandomEC2Instance() {
        return this._stopRandomEC2Instance;
    }

    @message([...standardFields, 'Cluster', 'Task Definition', 'Task'])
    private get stopRandomECSTask() {
        return this._stopRandomECSTask;
    }

    @message([...standardFields, 'Description', 'Replication Group ID'])
    private get failoverElasticache() {
        return this._failoverElasticache;
    }

    @message([...standardFields, 'Cluster'])
    private get failoverRandomDBCluster() {
        return this._failoverRandomDBCluster;
    }

    buildMessage(data: any, environment?: string) {
        switch (data.action) {
            case 'failoverElasticache':
                this.failoverElasticache.attachments[0].title = 'The chosen service is: ElastiCache';
                this.failoverElasticache.attachments[0].fields.forEach((field: { title: string; value: string; short: boolean }) => {
                    switch (field.title) {
                        case 'Chaos Function':
                            field.value = data.action;
                            break;
                        case 'Environment':
                            field.value = environment;
                            break;
                        case 'Description':
                            if (data.result.ReplicationGroup && data.result.ReplicationGroup.Description) {
                                field.value = data.result.ReplicationGroup.Description;
                            }
                            break;
                        case 'Replication Group ID':
                            if (data.result.ReplicationGroup && data.result.ReplicationGroup.ReplicationGroupId) {
                                field.value = data.result.ReplicationGroup.ReplicationGroupId;
                            }
                            break;
                    }
                });
                return this.failoverElasticache;
            case 'failoverRandomDBCluster':
                this.failoverRandomDBCluster.attachments[0].title = 'The chosen service is: RDS';
                this.failoverRandomDBCluster.attachments[0].fields.forEach((field: { title: string; value: string; short: boolean }) => {
                    switch (field.title) {
                        case 'Chaos Function':
                            field.value = data.action;
                            break;
                        case 'Environment':
                            field.value = environment;
                            break;
                        case 'Cluster':
                            if (data.result.DBCluster && data.result.DBCluster.DBClusterIdentifier) {
                                field.value = data.result.DBCluster.DBClusterIdentifier;
                            }
                            break;
                    }
                });
                return this.failoverRandomDBCluster;
            case 'stopRandomEC2Instance':
                this.stopRandomEC2Instance.attachments[0].title = 'The chosen service is: EC2';
                this.stopRandomEC2Instance.attachments[0].fields.forEach((field: { title: string; value: string; short: boolean }) => {
                    switch (field.title) {
                        case 'Chaos Function':
                            field.value = data.action;
                            break;
                        case 'Environment':
                            field.value = environment;
                            break;
                        case 'Instance':
                            if (data.result.StoppingInstances[0] && data.result.StoppingInstances[0].InstanceId) {
                                field.value = data.result.StoppingInstances[0].InstanceId;
                            }
                            break;
                        case 'Previous State':
                            if (data.result.StoppingInstances[0] && data.result.StoppingInstances[0].PreviousState) {
                                field.value = data.result.StoppingInstances[0].PreviousState;
                            }
                            break;
                        case 'Current State':
                            if (data.result.StoppingInstances[0] && data.result.StoppingInstances[0].CurrentState) {
                                field.value = data.result.StoppingInstances[0].CurrentState;
                            }
                            break;
                    }
                });
                return this.stopRandomEC2Instance;
            case 'stopRandomECSTask':
                this.stopRandomECSTask.attachments[0].title = 'The chosen service is: ECS';
                this.stopRandomECSTask.attachments[0].fields.forEach((field: { title: string; value: string; short: boolean }) => {
                    switch (field.title) {
                        case 'Chaos Function':
                            field.value = data.action;
                            break;
                        case 'Environment':
                            field.value = environment;
                            break;
                        case 'Cluster':
                            if (data.result.task && data.result.task.clusterArn) {
                                field.value = data.result.task.clusterArn;
                            }
                            break;
                        case 'Task Definition':
                            if (data.result.task && data.result.task.taskDefinitionArn) {
                                field.value = data.result.task.taskDefinitionArn;
                            }
                            break;
                        case 'Task':
                            if (data.result.task && data.result.task.taskArn) {
                                field.value = data.result.task.taskArn;
                            }
                            break;
                    }
                });
                return this.stopRandomECSTask;
            default:
                this.default.attachments[0].title = `Unable to find template for: ${data.service} and ${data.action}`;
                this.default.attachments[0].color = '#FF0000';
                return this._default;
        }
    }

    async send(data: any) {
        const url = process.env.SLACK_WEBHOOK_URL;
        try {
            const request = axios.post(url, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
            await request;
        } catch (error) {
            throw new Error(error);
        }
    }
}
