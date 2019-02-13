import { ECS as sdk, AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { Utility } from '../classes/utility';
import { chaosFunction } from '../decorators/chaosFunction';

export class ECS {
    private ecs: sdk;

    constructor() {
        this.ecs = new sdk();
    }

    /**
     * @description Lists ECS clusters
     * @returns {sdk.ListClustersResponse}
     */
    private async listClusters(): Promise<PromiseResult<sdk.ListClustersResponse, AWSError>> {
        try {
            const listClusters = this.ecs.listClusters({}).promise();
            return await listClusters;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * @description Lists tasks for a given ECS cluster
     * @param {string} cluster
     * @returns {sdk.ListTasksResponse}
     */
    private async listTasks(cluster: string): Promise<PromiseResult<sdk.ListTasksResponse, AWSError>> {
        try {
            const listTasks = this.ecs.listTasks({ cluster }).promise();
            return await listTasks;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * @description Stops a random ECS task
     * @returns {sdk.StopTaskResponse}
     */
    @chaosFunction()
    async stopRandomECSTask(): Promise<PromiseResult<sdk.StopTaskResponse, AWSError>> {
        try {
            const clusters = await this.listClusters();
            const cluster: string = Utility.getRandom(clusters.clusterArns);
            const clusterName = cluster.split('/').pop();

            const tasks = await this.listTasks(cluster);
            const task: string = Utility.getRandom(tasks.taskArns);

            if (!task) {
                console.log(`${clusterName} cluster has ${tasks.taskArns.length} tasks. Trying again...`);
                return this.stopRandomECSTask();
            }

            console.log(`The chosen cluster is: ${clusterName}`);
            console.log(`The chosen task is: ${task}`);

            return await this.stopTask(cluster, task);
        } catch (error) {
            return error.message;
        }
    }

    /**
     * @description Stops a running ECS task
     * @param {string} cluster
     * @param {string} task
     * @returns {sdk.StopTaskResponse}
     */
    private async stopTask(cluster: string, task: string): Promise<PromiseResult<sdk.StopTaskResponse, AWSError>> {
        try {
            const stopTask = this.ecs.stopTask({ cluster, task, reason: 'Stopped by chaos-duck' }).promise();
            return await stopTask;
        } catch (error) {
            throw new Error(error);
        }
    }
}
