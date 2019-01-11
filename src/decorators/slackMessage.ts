import { template } from '../classes/slack';

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
