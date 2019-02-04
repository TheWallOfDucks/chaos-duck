import { Chaos } from '../../src/classes/chaos';
import { stopRandomTask } from '../config/mocks/ecs/stopRandomTask';
const sinon = require('sinon');

describe('ECS', () => {
    describe('stopRandomTask', () => {
        const chaos = new Chaos(['ECS']);

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
