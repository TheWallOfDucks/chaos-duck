import { RDS as sdk } from 'aws-sdk';
import { Utility } from '../classes/utility';
import { chaosFunction } from '../decorators/chaosFunction';

export class RDS {
    private rds: sdk;

    constructor() {
        this.rds = new sdk();
    }

    private async describeDBClusters() {
        try {
            const describeDBClusters = this.rds.describeDBClusters({}).promise();
            return await describeDBClusters;
        } catch (error) {
            throw new Error(error);
        }
    }

    private async failoverDBCluster(DBClusterIdentifier: string, TargetDBInstanceIdentifier: string) {
        try {
            console.log(`Testing failover for DBClusterIdentifier: ${DBClusterIdentifier} and TargetDBInstanceIdentifier: ${TargetDBInstanceIdentifier}`);
            const failover = this.rds.failoverDBCluster({ DBClusterIdentifier, TargetDBInstanceIdentifier }).promise();
            return await failover;
        } catch (error) {
            throw new Error(error);
        }
    }

    @chaosFunction()
    async failoverRandomDBCluster() {
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
