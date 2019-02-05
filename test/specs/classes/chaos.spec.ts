import { Chaos } from '../../../src/classes/chaos';
import { stopRandomTask } from '../../config/mocks/ecs/stopRandomTask';
import { stopRandomEC2Instance } from '../../config/mocks/ec2/stopRandomEC2Instance';
import { failoverElasticache } from '../../config/mocks/elasticache/failoverElasticache';
import { failoverRandomDBCluster } from '../../config/mocks/rds/failoverRandomDBCluster';
import { Utility } from '../../../src/classes/utility';
const sinon = require('sinon');

describe('chaos', () => {
    describe('ec2', () => {
        const chaos = new Chaos(['EC2']);

        it('should be instantiated', () => {
            expect(chaos.ec2).toBeDefined();
            expect(chaos.services).toEqual(['EC2']);
        });

        describe('stopRandomEC2Instance', () => {
            beforeEach(() => {
                this.invoke = sinon.stub(chaos, 'invoke').returns(stopRandomEC2Instance);
                this.service = sinon.stub(chaos, 'service').value('EC2');
            });

            afterEach(() => {
                this.invoke.restore();
                this.service.restore();
            });

            it('should stop a random EC2 instance', async (done) => {
                const response = await chaos.invoke();
                expect(chaos.service).toBe('EC2');
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
            expect(chaos.services).toEqual(['ECS']);
        });

        describe('stopRandomTask', () => {
            beforeEach(() => {
                this.invoke = sinon.stub(chaos, 'invoke').returns(stopRandomTask);
                this.service = sinon.stub(chaos, 'service').value('ECS');
            });

            afterEach(() => {
                this.invoke.restore();
                this.service.restore();
            });

            it('should stop a random ECS task', async (done) => {
                const response = await chaos.invoke();
                expect(chaos.service).toBe('ECS');
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
            expect(chaos.services).toEqual(['ElastiCache']);
        });

        describe('failoverElasticache', () => {
            beforeEach(() => {
                this.invoke = sinon.stub(chaos, 'invoke').returns(failoverElasticache);
            });

            afterEach(() => {
                this.invoke.restore();
            });

            it('should failover ElastiCache', async (done) => {
                const response = await chaos.invoke();
                expect(response.service).toBe('elasticache');
                expect(response.action).toBe('failoverElasticache');
                expect(response.result.ReplicationGroup).toBeDefined();
                done();
            });
        });
    });

    describe('iam', () => {
        const chaos = new Chaos(['IAM']);

        it('should be instantiated', () => {
            expect(chaos.iam).toBeDefined();
            expect(chaos.services).toEqual(['IAM']);
        });

        it('should return ChaosFunctionNotFound error until a @chaosFunction is added', async (done) => {
            try {
                const response = await chaos.invoke();
                expect(response.result).toBe('Confirm that IAM service has at least one function decorated with @chaosFunction()');
            } catch (error) {
                fail(error);
            }
            done();
        });
    });

    describe('rds', () => {
        const chaos = new Chaos(['RDS']);

        it('should be instantiated', () => {
            expect(chaos.rds).toBeDefined();
            expect(chaos.services).toEqual(['RDS']);
        });

        describe('failoverRandomDBCluster', () => {
            beforeEach(() => {
                this.invoke = sinon.stub(chaos, 'invoke').returns(failoverRandomDBCluster);
            });

            afterEach(() => {
                this.invoke.restore();
            });

            it('should failover a random RDS cluster', async (done) => {
                const response = await chaos.invoke();
                expect(response.service).toBe('rds');
                expect(response.action).toBe('failoverRandomDBCluster');
                expect(response.result.DBCluster).toBeDefined();
                done();
            });
        });
    });

    describe('s3', () => {
        const chaos = new Chaos(['S3']);

        it('should be instantiated', () => {
            expect(chaos.s3).toBeDefined();
            expect(chaos.services).toEqual(['S3']);
        });

        it('should return ChaosFunctionNotFound error until a @chaosFunction is added', async (done) => {
            try {
                const response = await chaos.invoke();
                expect(response.result).toBe('Confirm that S3 service has at least one function decorated with @chaosFunction()');
            } catch (error) {
                fail(error);
            }
            done();
        });
    });

    describe('ses', () => {
        const chaos = new Chaos(['SES']);

        it('should be instantiated', () => {
            expect(chaos.ses).toBeDefined();
            expect(chaos.services).toEqual(['SES']);
        });

        it('should return ChaosFunctionNotFound error until a @chaosFunction is added', async (done) => {
            try {
                const response = await chaos.invoke();
                expect(chaos.service).toBe('SES');
                expect(chaos.chaosFunction).not.toBeDefined();
                expect(response.result).toBe('Confirm that SES service has at least one function decorated with @chaosFunction()');
            } catch (error) {
                fail(error);
            }
            done();
        });
    });

    describe('sts', () => {
        const chaos = new Chaos(['STS']);

        it('should be instantiated', () => {
            expect(chaos.sts).toBeDefined();
            expect(chaos.services).toEqual(['STS']);
        });

        it('should return ChaosFunctionNotFound error until a @chaosFunction is added', async (done) => {
            try {
                const response = await chaos.invoke();
                expect(chaos.service).toBe('STS');
                expect(chaos.chaosFunction).not.toBeDefined();
                expect(response.result).toBe('Confirm that STS service has at least one function decorated with @chaosFunction()');
            } catch (error) {
                fail(error);
            }
            done();
        });
    });

    describe('unknown service', () => {
        const chaos = new Chaos([]);

        it('should be instantiated', () => {
            expect(chaos.services).toEqual([]);
        });

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

    describe('multiple services', () => {
        const chaos = new Chaos(['ECS', 'RDS', 'ElastiCache']);

        beforeEach(() => {
            const possibleResponses = [stopRandomTask, failoverRandomDBCluster, failoverElasticache];
            this.invoke = sinon.stub(chaos, 'invoke').returns(Utility.getRandom(possibleResponses));
        });

        afterEach(() => {
            this.invoke.restore();
        });

        it('should be instantiated', () => {
            expect(chaos.ecs && chaos.rds && chaos.elasticache).toBeDefined();
            expect(chaos.services).toEqual(['ECS', 'RDS', 'ElastiCache']);
        });

        it('should execute a chaosFunction on a random service', async (done) => {
            const response = await chaos.invoke();
            expect(['ecs', 'rds', 'elasticache'].includes(response.service)).toBeTruthy();
            done();
        });
    });
});
