import { Email } from '../src/notification_providers/email';

describe('Emails', () => {
    const email = new Email();

    it('should be able to be sent', async (done) => {
        try {
            await email.send({
                service: 'ecs',
                action: 'stopRandomECSTask',
                result: {
                    task: {
                        taskArn: 'arn:aws:ecs:us-east-1:439153947667:task/d877c5cf-baec-4411-a8e9-1fd3048d40b5',
                        clusterArn: 'arn:aws:ecs:us-east-1:439153947667:cluster/NlbCluster',
                        taskDefinitionArn: 'arn:aws:ecs:us-east-1:439153947667:task-definition/users:36',
                        overrides: {
                            containerOverrides: [
                                {
                                    name: 'users',
                                },
                            ],
                        },
                        lastStatus: 'RUNNING',
                        desiredStatus: 'STOPPED',
                        cpu: '256',
                        memory: '2048',
                        containers: [
                            {
                                containerArn: 'arn:aws:ecs:us-east-1:439153947667:container/42a3e331-c41e-43af-9bad-0b3c65217688',
                                taskArn: 'arn:aws:ecs:us-east-1:439153947667:task/d877c5cf-baec-4411-a8e9-1fd3048d40b5',
                                name: 'users',
                                lastStatus: 'RUNNING',
                                networkBindings: [],
                                networkInterfaces: [
                                    {
                                        attachmentId: 'c16a7c73-0e75-49b4-b470-752063b2913e',
                                        privateIpv4Address: '10.192.21.253',
                                    },
                                ],
                            },
                        ],
                        startedBy: 'ecs-svc/9223370489982144024',
                        version: 4,
                        stoppedReason: 'Stopped by chaos-duck',
                        stopCode: 'UserInitiated',
                        connectivity: 'CONNECTED',
                        connectivityAt: '2019-01-17T16:26:54.569Z',
                        pullStartedAt: '2019-01-17T16:27:02.276Z',
                        pullStoppedAt: '2019-01-17T16:27:11.276Z',
                        createdAt: '2019-01-17T16:26:50.573Z',
                        startedAt: '2019-01-17T16:27:16.276Z',
                        stoppingAt: '2019-01-17T19:01:45.172Z',
                        group: 'service:users-10101',
                        launchType: 'FARGATE',
                        platformVersion: '1.3.0',
                        attachments: [
                            {
                                id: 'c16a7c73-0e75-49b4-b470-752063b2913e',
                                type: 'ElasticNetworkInterface',
                                status: 'ATTACHED',
                                details: [
                                    {
                                        name: 'subnetId',
                                        value: 'subnet-0ff91a8070946386c',
                                    },
                                    {
                                        name: 'networkInterfaceId',
                                        value: 'eni-5b33e66e',
                                    },
                                    {
                                        name: 'macAddress',
                                        value: '0e:59:80:f5:14:e8',
                                    },
                                    {
                                        name: 'privateIPv4Address',
                                        value: '10.192.21.253',
                                    },
                                ],
                            },
                        ],
                        tags: [],
                    },
                },
            });
        } catch (error) {
            fail(error);
        }

        done();
    });
});
