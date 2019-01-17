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

    @chaosFunction()
    async failoverDBCluster() {
        const clusters = await this.describeDBClusters();
        console.log(JSON.stringify(clusters));

        return;
    }
}
