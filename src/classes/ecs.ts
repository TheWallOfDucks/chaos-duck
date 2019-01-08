import { ECS as sdk } from 'aws-sdk';

export class ECS {
    private ecs = new sdk();

    constructor() {}

    async listClusters() {
        try {
            const listClusters = this.ecs.listClusters({}).promise();
            return await listClusters;
        } catch (error) {
            throw new Error(error);
        }
    }
}
