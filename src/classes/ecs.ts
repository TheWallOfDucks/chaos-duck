import { ECS as sdk } from 'aws-sdk';

export class ECS {
    private ecs: sdk;

    constructor() {
        this.ecs = new sdk();
    }

    async listClusters() {
        try {
            const listClusters = this.ecs.listClusters({}).promise();
            return await listClusters;
        } catch (error) {
            throw new Error(error);
        }
    }

    async listTasks(cluster: string) {
        try {
            const listTasks = this.ecs.listTasks({ cluster }).promise();
            return await listTasks;
        } catch (error) {
            throw new Error(error);
        }
    }

    async stopTask(cluster: string, task: string) {
        try {
            const stopTask = this.ecs.stopTask({ cluster, task, reason: 'Stopped by chaos-duck' }).promise();
            return await stopTask;
        } catch (error) {
            throw new Error(error);
        }
    }

    async stopRandomTask() {
        try {
            const clusters = await this.listClusters();
            const cluster = clusters.clusterArns[Math.floor(Math.random() * clusters.clusterArns.length)];
            const clusterName = cluster.split('/').pop();

            const tasks = await this.listTasks(cluster);
            const task = tasks.taskArns[Math.floor(Math.random() * tasks.taskArns.length)];

            if (!task) {
                return this.stopRandomTask();
            }

            console.log(`The chosen cluster is: ${clusterName}`);
            console.log(`The chosen task is: ${task}`);

            return await this.stopTask(cluster, task);
        } catch (error) {
            throw new Error(error);
        }
    }
}
