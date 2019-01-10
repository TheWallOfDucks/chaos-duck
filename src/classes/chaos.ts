import { chaosFunctions } from '../decorators';
import { ECS } from './ecs';
import { ElastiCache } from './elasticache';
import { SSM } from './ssm';
import { Utility } from './utility';

export class Chaos {
    private _ecs: ECS;
    private _elasticache: ElastiCache;
    private _services: string[] = [];
    private _ssm: SSM;

    constructor(services: string[]) {
        this.ecs = new ECS();
        this.elasticache = new ElastiCache();
        this.services = services;
        this.ssm = new SSM();
    }

    get ecs() {
        return this._ecs;
    }

    set ecs(value: ECS) {
        this._ecs = value;
    }

    get elasticache() {
        return this._elasticache;
    }

    set elasticache(value: ElastiCache) {
        this._elasticache = value;
    }

    get services() {
        return this._services;
    }

    set services(values: string[]) {
        this._services = values;
    }

    get ssm() {
        return this._ssm;
    }

    set ssm(value: SSM) {
        this._ssm = value;
    }

    async invoke() {
        try {
            this.ssm.setEnvironmentName();
            const service = Utility.getRandom(this.services);
            let chaosFunction: string;

            console.log(`The chosen service is: ${service}`);

            switch (service) {
                case 'ecs':
                    chaosFunction = Utility.getRandom(chaosFunctions[service]);
                    return {
                        service: 'ECS',
                        result: await this.ecs[chaosFunction](),
                    };
                case 'elasticache':
                    chaosFunction = Utility.getRandom(chaosFunctions[service]);
                    return {
                        service: 'ElastiCache',
                        result: await this.elasticache[chaosFunction](),
                    };
                default:
                    throw Error(
                        JSON.stringify({
                            service,
                            result: 'ServiceNotFound',
                            resolution: 'Provide a valid array of services to unleash chaos on',
                        }),
                    );
            }
        } catch (error) {
            throw error;
        }
    }
}
