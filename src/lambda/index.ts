import { Chaos } from '../classes/chaos';

export const handler = async (event) => {
    try {
        const chaos = new Chaos(['ecs', 'elasticache']);
        const result = await chaos.invoke();
        return {
            statusCode: 200,
            body: JSON.stringify(result, null, 2),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message }, null, 2),
        };
    }
};
