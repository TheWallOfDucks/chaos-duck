import { ECS } from '../classes/ecs';
import { ElastiCache } from '../classes/elasticache';

export const handler = async (event) => {
    const ecs = new ECS();
    const elasticache = new ElastiCache();

    const stoppedTask = await ecs.stopRandomTask();
    // console.log(JSON.stringify(stoppedTask, null, 2));

    // const failover = await elasticache.failover();

    return {
        statusCode: 200,
        body: JSON.stringify(stoppedTask, null, 2),
    };
};
