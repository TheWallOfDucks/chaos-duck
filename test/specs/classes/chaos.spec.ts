import { Chaos } from '../../../src/classes/chaos';
import { stopRandomTask } from '../../helpers/mocks/ecs/stopRandomTask';
import { stopRandomEC2Instance } from '../../helpers/mocks/ec2/stopRandomEC2Instance';
import { failoverElasticache } from '../../helpers/mocks/elasticache/failoverElasticache';
import { failoverRandomDBCluster } from '../../helpers/mocks/rds/failoverRandomDBCluster';
import { Utility } from '../../../src/classes/utility';
const sinon = require('sinon');

describe('chaos', () => {
    describe('ec2', () => {
        const chaos = new Chaos(['ec2']);

        it('should be instantiated', () => {
            expect(chaos.ec2).toBeDefined();
            expect(chaos.services).toEqual(['ec2']);
        });

        describe('stopRandomEC2Instance', () => {
            beforeEach(() => {
                this.invoke = sinon.stub(chaos, 'invoke').returns(stopRandomEC2Instance);
                this.service = sinon.stub(chaos, 'service').value('ec2');
            });

            afterEach(() => {
                this.invoke.restore();
                this.service.restore();
            });

            it('should stop a random EC2 instance', async (done) => {
                const response = await chaos.invoke();
                expect(chaos.service).toBe('ec2');
                expect(response.service).toBe('ec2');
                expect(response.action).toBe('stopRandomEC2Instance');
                expect(response.result.StoppingInstances).toBeDefined();
                done();
            });
        });
    });

    describe('ecs', () => {
        const chaos = new Chaos(['ecs']);

        it('should be instantiated', () => {
            expect(chaos.ecs).toBeDefined();
            expect(chaos.services).toEqual(['ecs']);
        });

        describe('stopRandomTask', () => {
            beforeEach(() => {
                this.invoke = sinon.stub(chaos, 'invoke').returns(stopRandomTask);
                this.service = sinon.stub(chaos, 'service').value('ecs');
            });

            afterEach(() => {
                this.invoke.restore();
                this.service.restore();
            });

            it('should stop a random ECS task', async (done) => {
                const response = await chaos.invoke();
                expect(chaos.service).toBe('ecs');
                expect(response.service).toBe('ecs');
                expect(response.action).toBe('stopRandomECSTask');
                expect(response.result.task).toBeDefined();
                done();
            });
        });
    });

    describe('elasticache', () => {
        const chaos = new Chaos(['elasticache']);

        it('should be instantiated', () => {
            expect(chaos.elasticache).toBeDefined();
            expect(chaos.services).toEqual(['elasticache']);
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
        const chaos = new Chaos(['iam']);

        it('should be instantiated', () => {
            expect(chaos.iam).toBeDefined();
            expect(chaos.services).toEqual(['iam']);
        });

        it('should return ChaosFunctionNotFound error until a @chaosFunction is added', async (done) => {
            try {
                const response = await chaos.invoke();
                expect(response.result).toBe('Confirm that iam service has at least one function decorated with @chaosFunction()');
            } catch (error) {
                fail(error);
            }
            done();
        });
    });

    describe('rds', () => {
        const chaos = new Chaos(['rds']);

        it('should be instantiated', () => {
            expect(chaos.rds).toBeDefined();
            expect(chaos.services).toEqual(['rds']);
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
        const chaos = new Chaos(['s3']);

        it('should be instantiated', () => {
            expect(chaos.s3).toBeDefined();
            expect(chaos.services).toEqual(['s3']);
        });

        it('should return ChaosFunctionNotFound error until a @chaosFunction is added', async (done) => {
            try {
                const response = await chaos.invoke();
                expect(response.result).toBe('Confirm that s3 service has at least one function decorated with @chaosFunction()');
            } catch (error) {
                fail(error);
            }
            done();
        });
    });

    describe('ses', () => {
        const chaos = new Chaos(['ses']);

        it('should be instantiated', () => {
            expect(chaos.ses).toBeDefined();
            expect(chaos.services).toEqual(['ses']);
        });

        it('should return ChaosFunctionNotFound error until a @chaosFunction is added', async (done) => {
            try {
                const response = await chaos.invoke();
                expect(chaos.service).toBe('ses');
                expect(chaos.chaosFunction).not.toBeDefined();
                expect(response.result).toBe('Confirm that ses service has at least one function decorated with @chaosFunction()');
            } catch (error) {
                fail(error);
            }
            done();
        });
    });

    describe('sts', () => {
        const chaos = new Chaos(['sts']);

        it('should be instantiated', () => {
            expect(chaos.sts).toBeDefined();
            expect(chaos.services).toEqual(['sts']);
        });

        it('should return ChaosFunctionNotFound error until a @chaosFunction is added', async (done) => {
            try {
                const response = await chaos.invoke();
                expect(chaos.service).toBe('sts');
                expect(chaos.chaosFunction).not.toBeDefined();
                expect(response.result).toBe('Confirm that sts service has at least one function decorated with @chaosFunction()');
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
        const chaos = new Chaos(['ecs', 'rds', 'elasticache']);

        beforeEach(() => {
            const possibleResponses = [stopRandomTask, failoverRandomDBCluster, failoverElasticache];
            this.invoke = sinon.stub(chaos, 'invoke').returns(Utility.getRandom(possibleResponses));
        });

        afterEach(() => {
            this.invoke.restore();
        });

        it('should be instantiated', () => {
            expect(chaos.ecs && chaos.rds && chaos.elasticache).toBeDefined();
            expect(chaos.services).toEqual(['ecs', 'rds', 'elasticache']);
        });

        it('should execute a chaosFunction on a random service', async (done) => {
            const response = await chaos.invoke();
            expect(['ecs', 'rds', 'elasticache'].includes(response.service)).toBeTruthy();
            done();
        });
    });

    describe('error', () => {
        const chaos = new Chaos(['ecs']);

        beforeEach(() => {
            this.getRandom = sinon.spy(Utility, 'getRandom');
            this.log = sinon.spy(console, 'log');
        });

        afterEach(() => {
            this.getRandom.restore();
            this.log.restore();
        });

        it('should return an error', async (done) => {
            const response = await chaos.invoke();
            expect(response.service).toBe('ecs');
            expect(response.result).toBe('ConfigError: Missing region in config');
            expect(this.getRandom.calledTwice).toBeTruthy();
            expect(this.getRandom.calledWith(['ecs'])).toBeTruthy();
            expect(this.log.calledTwice).toBeTruthy();
            expect(this.log.calledWith('The chosen service is: ecs')).toBeTruthy();
            done();
        });

        it('should suppress console logs', async (done) => {
            const response = await chaos.invoke(false);
            expect(response.service).toBe('ecs');
            expect(response.result).toBe('ConfigError: Missing region in config');
            expect(this.getRandom.calledTwice).toBeTruthy();
            expect(this.getRandom.calledWith(['ecs'])).toBeTruthy();
            expect(this.log.calledTwice).toBeFalsy();
            done();
        });
    });
});
