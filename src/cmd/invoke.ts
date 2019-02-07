import axios from 'axios';
import { InvalidUrl, InvalidServices } from '../classes/errors';
import { Utility } from '../classes/utility';

export const invoke = async (cmd: any) => {
    try {
        let chaosUrl: string;
        let services: any;
        const config = cmd.config || 'duck.json';

        if (cmd.url || cmd.services) {
            if (!Utility.validateUrl(cmd.url)) throw new InvalidUrl('Invalid url provided 🦆');
            if (!cmd.services) throw new InvalidServices('Invalid list of services provided 🦆');
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
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw error;
    }
};
