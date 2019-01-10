import { ECS as sdk } from 'aws-sdk';
import { Utility } from './utility';
import { chaosFunction } from '../decorators';

export class ECS {
    private ecs: sdk;

    constructor() {
        this.ecs = new sdk();
    }

    private async listClusters() {
        try {
            const listClusters = this.ecs.listClusters({}).promise();
            return await listClusters;
        } catch (error) {
            throw new Error(error);
        }
    }

    private async listTasks(cluster: string) {
        try {
            const listTasks = this.ecs.listTasks({ cluster }).promise();
            return await listTasks;
        } catch (error) {
            throw new Error(error);
        }
    }

    @chaosFunction()
    async stopRandomTask() {
        try {
            const clusters = await this.listClusters();
            const cluster: string = Utility.getRandom(clusters.clusterArns);
            const clusterName = cluster.split('/').pop();

            const tasks = await this.listTasks(cluster);
            const task: string = Utility.getRandom(tasks.taskArns);

            if (!task) {
                console.log(`${clusterName} cluster has ${tasks.taskArns.length} tasks. Trying again...`);
                return this.stopRandomTask();
            }

            console.log(`The chosen cluster is: ${clusterName}`);
            console.log(`The chosen task is: ${task}`);

            return await this.stopTask(cluster, task);
        } catch (error) {
            throw new Error(error);
        }
    }

    private async stopTask(cluster: string, task: string) {
        try {
            const stopTask = this.ecs.stopTask({ cluster, task, reason: 'Stopped by chaos-duck' }).promise();
            return await stopTask;
        } catch (error) {
            throw new Error(error);
        }
    }
}
