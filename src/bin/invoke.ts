import axios from 'axios';

export const invoke = async (cmd: any) => {
    try {
        let chaosUrl: string;
        let services: any;
        const config = cmd.config;

        if (config) {
            const conf = require(`${process.cwd()}/${config}`);
            chaosUrl = conf.chaosUrl;
            services = conf.services;
        } else {
            chaosUrl = cmd.url;
            services = cmd.services;
        }

        if (services) {
            services = services.split(',');
            services = { services };
        }

        const request = axios.post(chaosUrl, services);
        const response = await request;

        return response.data;
        // console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        throw new Error(error);
    }
};
