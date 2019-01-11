import { chaosFunctions } from '../decorators/chaosFunction';
import { EC2 } from '../services/ec2';
import { ECS } from '../services/ecs';
import { ElastiCache } from '../services/elasticache';
import { SSM } from '../services/ssm';
import { Utility } from './utility';

export class Chaos {
    private _ec2: EC2;
    private _ecs: ECS;
    private _elasticache: ElastiCache;
    private _services: string[] = [];
    private _ssm: SSM;

    constructor(services: string[]) {
        this.ec2 = new EC2();
        this.ecs = new ECS();
        this.elasticache = new ElastiCache();
        this.services = services;
        this.ssm = new SSM();
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

            if (!service) {
                throw Error(
                    JSON.stringify({
                        service,
                        result: 'ServiceNotFound',
                        resolution: 'Provide a valid array of services to unleash chaos on',
                    }),
                );
            }

            const chaosFunction = Utility.getRandom(chaosFunctions[service]);

            if (!chaosFunction) {
                throw Error(
                    JSON.stringify({
                        service,
                        result: 'ChaosFunctionNotFound',
                        resolution: `Confirm that ${service} service has at least one function decorated with @chaosFunction()`,
                    }),
                );
            }

            console.log(`The chosen service is: ${service}`);
            console.log(`The chosen function is: ${chaosFunction}`);

            return {
                service,
                action: chaosFunction,
                result: await this[service][chaosFunction](),
            };
        } catch (error) {
            throw error;
        }
    }
}
