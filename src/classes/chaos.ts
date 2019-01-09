import { ECS } from './ecs';
import { ElastiCache } from './elasticache';
import { Utility } from './utility';

export class Chaos {
    private _ecs: ECS;
    private _elasticache: ElastiCache;
    private _services: string[] = [];

    constructor(services: string[]) {
        this.ecs = new ECS();
        this.elasticache = new ElastiCache();
        this.services = services;
    }

    get chaosObject() {
        return {
            ecs: [],
            elasticache: [],
        };
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

    async invoke() {
        const service = Utility.getRandom(this.services);
        let chaosFunctions: PropertyDescriptor;
        let chaosFunction: string;

        console.log(`The chosen service is ${service}`);

        switch (service) {
            case 'ecs':
                chaosFunctions = Object.getOwnPropertyDescriptor(ECS.prototype, 'chaos');
                chaosFunction = Utility.getRandom(chaosFunctions.value);
                return {
                    service: 'ECS',
                    result: await this.ecs[chaosFunction](),
                };
            case 'elasticache':
                chaosFunctions = Object.getOwnPropertyDescriptor(ElastiCache.prototype, 'chaos');
                chaosFunction = Utility.getRandom(chaosFunctions.value);
                return {
                    service: 'ElastiCache',
                    result: await this.elasticache[chaosFunction](),
                };
            default:
                return `Unable to find chaos function for ${service}`;
        }
    }

    get services() {
        return this._services;
    }

    set services(values: string[]) {
        this._services = values;
    }
}
