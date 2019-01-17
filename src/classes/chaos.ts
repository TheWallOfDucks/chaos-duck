import { chaosFunctions } from '../decorators/chaosFunction';
import { EC2 } from '../services/ec2';
import { ECS } from '../services/ecs';
import { ElastiCache } from '../services/elasticache';
import { Utility } from './utility';

/**
 * @description Chaos class is the main interface to randomly execute chaosFunctions against services.
 * All chaos services should be given their own, lowercase, getter/setter.
 */
export class Chaos {
    private _chaosFunction: string;
    private _ec2: EC2;
    private _ecs: ECS;
    private _elasticache: ElastiCache;
    private _service: string;
    private _services: string[] = [];

    constructor(services: string[]) {
        this.ec2 = new EC2();
        this.ecs = new ECS();
        this.elasticache = new ElastiCache();
        this.services = services;
    }

    get chaosFunction() {
        return this._chaosFunction;
    }

    set chaosFunction(value: string) {
        this._chaosFunction = value;
    }

    get ec2() {
        return this._ec2;
    }

    set ec2(value: EC2) {
        this._ec2 = value;
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

    get service() {
        return this._service;
    }

    set service(value: string) {
        this._service = value;
    }

    get services() {
        return this._services;
    }

    set services(values: string[]) {
        this._services = values;
    }

    async invoke() {
        try {
            this.service = Utility.getRandom(this.services);

            if (!this.service) {
                throw Error(
                    JSON.stringify({
                        service: this.service,
                        result: 'ServiceNotFound',
                        resolution: 'Provide a valid array of services to unleash chaos on',
                    }),
                );
            }

            this.chaosFunction = Utility.getRandom(chaosFunctions[this.service]);

            if (!this.chaosFunction) {
                throw Error(
                    JSON.stringify({
                        service: this.service,
                        result: 'ChaosFunctionNotFound',
                        resolution: `Confirm that ${this.service} service has at least one function decorated with @chaosFunction()`,
                    }),
                );
            }

            console.log(`The chosen service is: ${this.service}`);
            console.log(`The chosen function is: ${this.chaosFunction}`);

            return {
                service: this.service,
                action: this.chaosFunction,
                result: await this[this.service][this.chaosFunction](),
            };
        } catch (error) {
            return {
                service: this.service,
                action: this.chaosFunction,
                result: error.message,
            };
        }
    }
}
