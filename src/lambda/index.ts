import { ECS } from '../classes/ecs';

export const handler = async (event) => {
    const ecs = new ECS();
    const clusters = await ecs.listClusters();

    return {
        statusCode: 200,
        body: JSON.stringify(clusters, null, 2),
    };
};
