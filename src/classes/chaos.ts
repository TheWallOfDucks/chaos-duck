import { chaosFunctions } from '../decorators/chaosFunction';
import { EC2 } from '../services/ec2';
import { ECS } from '../services/ecs';
import { ElastiCache } from '../services/elasticache';
import { IAM } from '../services/iam';
import { RDS } from '../services/rds';
import { S3 } from '../services/s3';
import { SES } from '../services/ses';
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
    private _iam: IAM;
    private _rds: RDS;
    private _s3: S3;
    private _service: string;
    private _services: string[] = [];
    private _ses: SES;

    constructor(services: string[]) {
        this.ec2 = new EC2();
        this.ecs = new ECS();
        this.elasticache = new ElastiCache();
        this.iam = new IAM();
        this.rds = new RDS();
        this.s3 = new S3();
        this.services = services;
        this.ses = new SES();
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

    get iam() {
        return this._iam;
    }

    set iam(value: IAM) {
        this._iam = value;
    }

    get rds() {
        return this._rds;
    }

    set rds(value: RDS) {
        this._rds = value;
    }

    get s3() {
        return this._s3;
    }

    set s3(value: S3) {
        this._s3 = value;
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

    get ses() {
        return this._ses;
    }

    set ses(value: SES) {
        this._ses = value;
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
