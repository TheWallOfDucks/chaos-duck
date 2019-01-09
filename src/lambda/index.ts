import { ECS } from '../classes/ecs';
import { ElastiCache } from '../classes/elasticache';
import { Utility } from '../classes/utility';

export const handler = async (event) => {
    const ecs = new ECS();
    const elasticache = new ElastiCache();
    const chaosActions = [ecs.stopRandomTask(), elasticache.failover()];
    const action = Utility.getRandom(chaosActions);

    console.log(`The chosen action is: ${action}`);

    const result = await action;

    return {
        statusCode: 200,
        body: JSON.stringify(result, null, 2),
    };
};
