import { Chaos } from '../classes/chaos';

export const handler = async (event) => {
    try {
        let services: string[];

        if (event.body) {
            const body = JSON.parse(event.body);
            services = body.services || ['ecs', 'elasticache'];
        } else {
            services = ['ecs', 'elasticache'];
        }

        console.log(`Desired services to unleash chaos-duck on are: ${services}`);

        const chaos = new Chaos(services);
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
