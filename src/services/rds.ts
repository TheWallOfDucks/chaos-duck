import { RDS as sdk, AWSError } from 'aws-sdk';
import { Utility } from '../classes/utility';
import { chaosFunction } from '../decorators/chaosFunction';
import { PromiseResult } from 'aws-sdk/lib/request';

export class RDS {
    private rds: sdk;

    constructor() {
        this.rds = new sdk();
    }

    /**
     * @description Lists information about provisioned Aurora DB clusters
     * @returns {sdk.DBClusterMessage}
     */
    private async describeDBClusters(): Promise<PromiseResult<sdk.DBClusterMessage, AWSError>> {
        try {
            const describeDBClusters = this.rds.describeDBClusters({}).promise();
            return await describeDBClusters;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * @description Forces failover of the specified DB cluster. A failover for a DB cluster promotes one of the Aurora Replicas (read-only instances) in the DB cluster to be the primary instance (the cluster writer)
     * @param {string} DBClusterIdentifier
     * @param {string} TargetDBInstanceIdentifier
     * @returns {sdk.FailoverDBClusterResult}
     */
    private async failoverDBCluster(DBClusterIdentifier: string, TargetDBInstanceIdentifier: string): Promise<PromiseResult<sdk.FailoverDBClusterResult, AWSError>> {
        try {
            console.log(`Testing failover for DBClusterIdentifier: ${DBClusterIdentifier} and TargetDBInstanceIdentifier: ${TargetDBInstanceIdentifier}`);
            const failover = this.rds.failoverDBCluster({ DBClusterIdentifier, TargetDBInstanceIdentifier }).promise();
            return await failover;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * @description Fails over a random DB cluster
     * @returns {sdk.FailoverDBClusterResult}
     */
    @chaosFunction()
    async failoverRandomDBCluster(): Promise<PromiseResult<sdk.FailoverDBClusterResult, AWSError> | string> {
        const clusters = await this.describeDBClusters();
        const availableClusters: sdk.DBCluster[] = [];

        clusters.DBClusters.forEach((cluster) => {
            if (cluster.Status === 'available') availableClusters.push(cluster);
        });

        const cluster: sdk.DBCluster = Utility.getRandom(availableClusters);
        const clusterPromotionMembers: sdk.DBClusterMember[] = [];

        cluster.DBClusterMembers.forEach((member) => {
            if (member.PromotionTier === 1 && !member.IsClusterWriter) {
                clusterPromotionMembers.push(member);
            }
        });

        const promotionInstance: sdk.DBClusterMember = Utility.getRandom(clusterPromotionMembers);

        if (!promotionInstance) return `There is no available instance for promotion in ${cluster.DBClusterIdentifier}`;

        console.log(`The chosen cluster is: ${cluster.DBClusterIdentifier}`);
        console.log(`The chosen replacement primary instance is: ${promotionInstance.DBInstanceIdentifier}`);

        return await this.failoverDBCluster(cluster.DBClusterIdentifier, promotionInstance.DBInstanceIdentifier);
    }
}
