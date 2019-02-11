import { ElastiCache as sdk, AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { Utility } from '../classes/utility';
import { chaosFunction } from '../decorators/chaosFunction';

/**
 * @description ElastiCache service class
 */
export class ElastiCache {
    private elasticache: sdk;

    constructor() {
        this.elasticache = new sdk();
    }

    private async describeCacheClusters() {
        try {
            const describeCacheClusters = this.elasticache.describeCacheClusters({}).promise();
            return await describeCacheClusters;
        } catch (error) {
            throw new Error(error);
        }
    }

    private async describeReplicationGroups(ReplicationGroupId: string) {
        try {
            const describeReplicationGroups = this.elasticache.describeReplicationGroups({ ReplicationGroupId }).promise();
            return await describeReplicationGroups;
        } catch (error) {
            throw new Error(error);
        }
    }

    @chaosFunction()
    async failoverElasticache(): Promise<PromiseResult<sdk.TestFailoverResult, AWSError>> {
        try {
            const clusters = await this.describeCacheClusters();

            const cluster: sdk.CacheCluster = Utility.getRandom(clusters.CacheClusters);
            console.log(`Chosen ElastiCache cluster: ${JSON.stringify(cluster, null, 2)}`);

            const replicationGroups = await this.describeReplicationGroups(cluster.ReplicationGroupId);
            const replicationGroup: sdk.ReplicationGroup = Utility.getRandom(replicationGroups.ReplicationGroups);
            const nodeGroup: sdk.NodeGroup = Utility.getRandom(replicationGroup.NodeGroups);

            return this.testFailover(nodeGroup.NodeGroupId, replicationGroup.ReplicationGroupId);
        } catch (error) {
            return error.message;
        }
    }

    private async testFailover(NodeGroupId: string, ReplicationGroupId: string) {
        try {
            console.log(`Testing failover for NodeGroupId: ${NodeGroupId} and ReplicationGroupId: ${ReplicationGroupId}`);
            const testFailover = this.elasticache.testFailover({ NodeGroupId, ReplicationGroupId }).promise();
            return await testFailover;
        } catch (error) {
            throw new Error(error);
        }
    }
}
