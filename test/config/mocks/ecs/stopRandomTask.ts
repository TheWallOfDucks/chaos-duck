export const stopRandomTask = {
    service: 'ecs',
    action: 'stopRandomECSTask',
    result: {
        task: {
            taskArn: 'arn:aws:ecs:us-east-1:439153947667:task/2119c324-3f93-4749-a454-301320670893',
            clusterArn: 'arn:aws:ecs:us-east-1:439153947667:cluster/NlbCluster',
            taskDefinitionArn: 'arn:aws:ecs:us-east-1:439153947667:task-definition/proxy:29',
            overrides: {
                containerOverrides: [
                    {
                        name: 'proxy',
                    },
                ],
            },
            lastStatus: 'RUNNING',
            desiredStatus: 'STOPPED',
            cpu: '512',
            memory: '1024',
            containers: [
                {
                    containerArn: 'arn:aws:ecs:us-east-1:439153947667:container/aa8f7ef1-0090-4d7d-a91a-5b5f8a39c612',
                    taskArn: 'arn:aws:ecs:us-east-1:439153947667:task/2119c324-3f93-4749-a454-301320670893',
                    name: 'proxy',
                    lastStatus: 'RUNNING',
                    networkBindings: [],
                    networkInterfaces: [
                        {
                            attachmentId: '66c7d59f-dd69-4594-aac7-2f0b2c8b8772',
                            privateIpv4Address: '10.192.22.103',
                        },
                    ],
                },
            ],
            startedBy: 'ecs-svc/9223370487917310071',
            version: 4,
            stoppedReason: 'Stopped by chaos-duck',
            stopCode: 'UserInitiated',
            connectivity: 'CONNECTED',
            connectivityAt: '2019-02-02T14:15:17.781Z',
            pullStartedAt: '2019-02-02T14:15:30.497Z',
            pullStoppedAt: '2019-02-02T14:15:31.497Z',
            createdAt: '2019-02-02T14:15:14.215Z',
            startedAt: '2019-02-02T14:15:32.497Z',
            stoppingAt: '2019-02-04T15:15:04.533Z',
            group: 'service:proxy-60001',
            launchType: 'FARGATE',
            platformVersion: '1.3.0',
            attachments: [
                {
                    id: '66c7d59f-dd69-4594-aac7-2f0b2c8b8772',
                    type: 'ElasticNetworkInterface',
                    status: 'ATTACHED',
                    details: [
                        {
                            name: 'subnetId',
                            value: 'subnet-094f98d450f5bb18c',
                        },
                        {
                            name: 'networkInterfaceId',
                            value: 'eni-0dad2b6905fe56075',
                        },
                        {
                            name: 'macAddress',
                            value: '02:13:9b:47:33:18',
                        },
                        {
                            name: 'privateIPv4Address',
                            value: '10.192.22.103',
                        },
                    ],
                },
            ],
            tags: [],
        },
    },
};
