/**
 * @description This function returns a valid schedule object to deploy with serverless
 * @returns {{rate: string; enabled: boolean; input: { body: any }}}
 */
export const schedule = (): { rate: string; enabled: boolean; input: { body: any } } => {
    let rate: string = '1 hour';
    let enabled: boolean = false;
    const input = {
        body: {},
    };
    let services: string[];

    if (process.env.RATE && process.env.RATE !== 'undefined') {
        rate = process.env.RATE;
        enabled = true;
        services = process.env.SERVICES.split(',');
        input.body['services'] = services;
    }

    return { rate: `rate(${rate})`, enabled, input };
};
