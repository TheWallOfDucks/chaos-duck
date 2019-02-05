import axios from 'axios';

export const invoke = async (cmd: any) => {
    try {
        let chaosUrl: string;
        let services: any;
        const config = cmd.config || 'duck.json';

        if (cmd.url || cmd.services) {
            chaosUrl = cmd.url;
            services = cmd.services.replace(' ', '');
        } else {
            const conf = require(`${process.cwd()}/${config}`);
            chaosUrl = conf.chaosUrl;
            services = conf.services.replace(' ', '');
        }

        if (services) {
            services = services.split(',');
            services = { services };
        }

        const request = axios.post(chaosUrl, services);
        const response = await request;

        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
