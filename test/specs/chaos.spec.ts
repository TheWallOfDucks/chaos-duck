import { Chaos } from '../../src/classes/chaos';
import { stopRandomTask } from '../config/mocks/ecs/stopRandomTask';
const sinon = require('sinon');

describe('chaos.ts', () => {
    describe('ecs', () => {
        const chaos = new Chaos(['ECS']);

        it('should be instantiated', () => {
            expect(chaos.ecs).toBeDefined();
        });

        describe('stopRandomTask', () => {
            beforeEach(() => {
                this.invoke = sinon.stub(chaos, 'invoke').returns(stopRandomTask);
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
