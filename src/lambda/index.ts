import { Chaos } from '../classes/chaos';
import { SupportedServices } from '../config/supportedServices';
import { Utility } from '../classes/utility';
import { Notification } from '../classes/notification';
const environment = process.env.AWS_ENV;

/**
 * @description Lambda handler
 * @param {} event
 */
export const handler = async (event) => {
    try {
        let services: string[];
        const notification = new Notification();

        if (event.body) {
            let body;
            try {
                body = JSON.parse(event.body);
            } catch (error) {
                if (error.message === 'Unexpected token o in JSON at position 1') body = event.body;
            }
            services = Utility.convertToLowercase(body.services) || Object.values(SupportedServices);
        } else {
            services = Object.values(SupportedServices);
        }

        console.log(`Desired services to unleash chaos-duck on are: ${services}`);

        const chaos = new Chaos(services);
        const result = await chaos.invoke();

        console.log('Result: ', result);

        if (notification.enabled) {
            console.log('Sending notification...');
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
