import { Chaos } from '../classes/chaos';
import { Utility } from '../classes/utility';
import { Notification } from '../classes/notification';
const environment = process.env.AWS_ENV;

export const handler = async (event) => {
    try {
        let services: string[];
        const notification = new Notification();

        if (event.body) {
            const body = JSON.parse(event.body);
            services = Utility.convertToLowercase(body.services) || ['ecs', 'elasticache'];
        } else {
            services = ['ecs', 'elasticache'];
        }

        console.log(`Desired services to unleash chaos-duck on are: ${services}`);

        const chaos = new Chaos(services);
        const result = await chaos.invoke();

        if (notification.enabled) {
            await notification.send(result, environment);
        }

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
