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

    /**
     * @description Lists all provisioned cache clusters
     * @returns {sdk.CacheClusterMessage}
     */
    private async describeCacheClusters(): Promise<PromiseResult<sdk.CacheClusterMessage, AWSError>> {
        try {
            const describeCacheClusters = this.elasticache.describeCacheClusters({}).promise();
            return await describeCacheClusters;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * @description Lists information about a given replication group
     * @param {string} ReplicationGroupId
     * @returns {sdk.ReplicationGroupMessage}
     */
    private async describeReplicationGroups(ReplicationGroupId: string): Promise<PromiseResult<sdk.ReplicationGroupMessage, AWSError>> {
        try {
            const describeReplicationGroups = this.elasticache.describeReplicationGroups({ ReplicationGroupId }).promise();
            return await describeReplicationGroups;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * @description Fails over a random node in a replication group
     * @returns {sdk.TestFailoverResult}
     */
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

    /**
     * @description Fails over a node in a specified replication group
     * @param {string} NodeGroupId
     * @param {string} ReplicationGroupId
     * @returns {sdk.TestFailoverResult}
     */
    private async testFailover(NodeGroupId: string, ReplicationGroupId: string): Promise<PromiseResult<sdk.TestFailoverResult, AWSError>> {
        try {
            console.log(`Testing failover for NodeGroupId: ${NodeGroupId} and ReplicationGroupId: ${ReplicationGroupId}`);
            const testFailover = this.elasticache.testFailover({ NodeGroupId, ReplicationGroupId }).promise();
            return await testFailover;
        } catch (error) {
            throw new Error(error);
        }
    }
}
