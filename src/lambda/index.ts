import { Chaos } from '../classes/chaos';
import { Utility } from '../classes/utility';
import { ECS } from '../classes/ecs';

export const handler = async (event) => {
    const chaos = new Chaos(['ecs', 'elasticache']);
    const result = await chaos.invoke();
    // const ecs = new ECS();
    // const result = await ecs.stopRandomTask();

    return {
        statusCode: 200,
        body: JSON.stringify(result, null, 2),
    };
};
