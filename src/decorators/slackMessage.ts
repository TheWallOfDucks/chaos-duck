import { template } from '../notification_providers/slack';

/**
 * @todo This needs to be based on chaosFunction and not on service...
 * @description Defines the field titles to be exposed in the slack message based on service
 * @param {string[]} titles
 */
export function message(titles: string[]) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const serviceTemplate = JSON.parse(JSON.stringify(template));
        serviceTemplate.attachments[0].fields = [];

        titles.forEach((title) => {
            serviceTemplate.attachments[0].fields.push({
                title,
                value: '',
                short: false,
            });
        });

        Object.defineProperty(target, `_${key}`, { value: serviceTemplate });
    };
}
