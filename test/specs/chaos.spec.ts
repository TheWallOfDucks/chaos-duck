import { Chaos } from '../../src/classes/chaos';
import { stopRandomTask } from '../config/mocks/ecs/stopRandomTask';
import { stopRandomEC2Instance } from '../config/mocks/ec2/stopRandomEC2Instance';
import { failoverElasticache } from '../config/mocks/elasticache/failoverElasticache';
const sinon = require('sinon');

describe('chaos.ts', () => {
    describe('ec2', () => {
        const chaos = new Chaos(['EC2']);

        it('should be instantiated', () => {
            expect(chaos.ec2).toBeDefined();
        });

        describe('stopRandomEC2Instance', () => {
            beforeEach(() => {
                this.invoke = sinon.stub(chaos, 'invoke').returns(stopRandomEC2Instance);
            });

            afterEach(() => {
                this.invoke.restore();
            });

            it('should stop a random EC2 instance', async (done) => {
                const response = await chaos.invoke();
                expect(response.service).toBe('ec2');
                expect(response.action).toBe('stopRandomEC2Instance');
                expect(response.result.StoppingInstances).toBeDefined();
                done();
            });
        });
    });

    describe('ecs', () => {
        const chaos = new Chaos(['ECS']);

        it('should be instantiated', () => {
            expect(chaos.ecs).toBeDefined();
        });

        describe('stopRandomTask', () => {
            beforeEach(() => {
                this.invoke = sinon.stub(chaos, 'invoke').returns(stopRandomTask);
            });

            afterEach(() => {
                this.invoke.restore();
            });

            it('should stop a random ECS task', async (done) => {
                const response = await chaos.invoke();
                expect(response.service).toBe('ecs');
                expect(response.action).toBe('stopRandomECSTask');
                expect(response.result.task).toBeDefined();
                done();
            });
        });
    });

    describe('elasticache', () => {
        const chaos = new Chaos(['ElastiCache']);

        it('should be instantiated', () => {
            expect(chaos.elasticache).toBeDefined();
        });

        describe('failoverElasticache', () => {
            beforeEach(() => {
                this.invoke = sinon.stub(chaos, 'invoke').returns(failoverElasticache);
            });

            afterEach(() => {
                this.invoke.restore();
            });

            it('should stop a random ECS task', async (done) => {
                const response = await chaos.invoke();
                expect(response.service).toBe('elasticache');
                expect(response.action).toBe('failoverElasticache');
                expect(response.result.ReplicationGroup).toBeDefined();
                done();
            });
        });
    });

    describe('ServiceNotFound', () => {
        const chaos = new Chaos([]);

        it('should return a ServiceNotFound error', async (done) => {
            try {
                const response = await chaos.invoke();
                expect(response.result).toBe('Provide a valid array of services to unleash chaos on');
            } catch (error) {
                fail(error);
            }
            done();
        });
    });

    describe('ChaosFunctionNotFound', () => {
        const chaos = new Chaos(['IAM']);

        it('should return a ChaosFunctionNotFound error', async (done) => {
            try {
                const response = await chaos.invoke();
                expect(response.result).toBe('Provide a valid array of services to unleash chaos on');
            } catch (error) {
                fail(error);
            }
            done();
        });
    });
});
