export const stopRandomEC2Instance = {
    service: 'ec2',
    action: 'stopRandomEC2Instance',
    result: {
        StoppingInstances: [
            {
                CurrentState: {
                    Code: 64,
                    Name: 'stopping',
                },
                InstanceId: 'i-1234567890abcdef0',
                PreviousState: {
                    Code: 16,
                    Name: 'running',
                },
            },
        ],
    },
};
