export const failoverElasticache = {
    service: 'elasticache',
    action: 'failoverElasticache',
    result: {
        ResponseMetadata: {
            RequestId: '8598105e-2303-11e9-9476-afaa20bfff87',
        },
        ReplicationGroup: {
            ReplicationGroupId: 'elr13vd5vbs7enmp',
            Description: 'Redis Replication Group with Auto-Failover',
            Status: 'available',
            PendingModifiedValues: {},
            MemberClusters: ['elr13vd5vbs7enmp-0001-001', 'elr13vd5vbs7enmp-0001-002', 'elr13vd5vbs7enmp-0002-001', 'elr13vd5vbs7enmp-0002-002'],
            NodeGroups: [
                {
                    NodeGroupId: '0001',
                    Status: 'available',
                    Slots: '0-8191',
                    NodeGroupMembers: [
                        {
                            CacheClusterId: 'elr13vd5vbs7enmp-0001-001',
                            CacheNodeId: '0001',
                            PreferredAvailabilityZone: 'us-east-1c',
                        },
                        {
                            CacheClusterId: 'elr13vd5vbs7enmp-0001-002',
                            CacheNodeId: '0001',
                            PreferredAvailabilityZone: 'us-east-1a',
                        },
                    ],
                },
                {
                    NodeGroupId: '0002',
                    Status: 'available',
                    Slots: '8192-16383',
                    NodeGroupMembers: [
                        {
                            CacheClusterId: 'elr13vd5vbs7enmp-0002-001',
                            CacheNodeId: '0001',
                            PreferredAvailabilityZone: 'us-east-1b',
                        },
                        {
                            CacheClusterId: 'elr13vd5vbs7enmp-0002-002',
                            CacheNodeId: '0001',
                            PreferredAvailabilityZone: 'us-east-1c',
                        },
                    ],
                },
            ],
            AutomaticFailover: 'enabled',
            ConfigurationEndpoint: {
                Address: 'clustercfg.elr13vd5vbs7enmp.n3jdkk.use1.cache.amazonaws.com',
                Port: 6379,
            },
            SnapshotRetentionLimit: 5,
            SnapshotWindow: '06:00-07:00',
            ClusterEnabled: true,
            CacheNodeType: 'cache.t2.small',
            TransitEncryptionEnabled: true,
            AtRestEncryptionEnabled: true,
        },
    },
};
