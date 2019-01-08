import { ElastiCache as sdk } from 'aws-sdk';

export class ElastiCache {
    private elasticache: sdk;

    constructor() {
        this.elasticache = new sdk();
    }

    async describeCacheClusters() {
        try {
            const describeCacheClusters = this.elasticache.describeCacheClusters({}).promise();
            return await describeCacheClusters;
        } catch (error) {
            throw new Error(error);
        }
    }

    async describeReplicationGroups(ReplicationGroupId: string) {
        try {
            const describeReplicationGroups = this.elasticache.describeReplicationGroups({ ReplicationGroupId }).promise();
            return await describeReplicationGroups;
        } catch (error) {
            throw new Error(error);
        }
    }

    async failover() {
        try {
            const cacheClusters = [];
            const clusters = await this.describeCacheClusters();

            clusters.CacheClusters.forEach((cluster) => {
                if (cluster.Engine !== 'memcached') {
                    cacheClusters.push(cluster);
                }
            });

            const cluster = clusters.CacheClusters[Math.floor(Math.random() * clusters.CacheClusters.length)];
            console.log(`Chosen ElastiCache cluster: ${JSON.stringify(cluster, null, 2)}`);

            const replicationGroups = await this.describeReplicationGroups(cluster.ReplicationGroupId);
            const replicationGroup = replicationGroups.ReplicationGroups[Math.floor(Math.random() * replicationGroups.ReplicationGroups.length)];
            const nodeGroup = replicationGroup.NodeGroups[Math.floor(Math.random() * replicationGroup.NodeGroups.length)];

            return this.testFailover(nodeGroup.NodeGroupId, replicationGroup.ReplicationGroupId);
        } catch (error) {
            throw new Error(error);
        }
    }

    async testFailover(NodeGroupId, ReplicationGroupId) {
        try {
            console.log(`Testing failover for NodeGroupId: ${NodeGroupId} and ReplicationGroupId: ${ReplicationGroupId}`);
            const testFailover = this.elasticache.testFailover({ NodeGroupId, ReplicationGroupId }).promise();
            return await testFailover;
        } catch (error) {
            throw new Error(error);
        }
    }
}
