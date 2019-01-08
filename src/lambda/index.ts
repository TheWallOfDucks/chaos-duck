import { ECS } from '../classes/ecs';

export const handler = async (event) => {
    const ecs = new ECS();
    const stoppedTask = await ecs.stopRandomTask();
    console.log(JSON.stringify(stoppedTask, null, 2));

    return {
        statusCode: 200,
        body: JSON.stringify(stoppedTask, null, 2),
    };
};
