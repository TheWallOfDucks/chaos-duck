import { ECS } from '../../../src/services/ecs';
import { listClusters } from '../../config/mocks/ecs/listClusters';
import { listTasks } from '../../config/mocks/ecs/listTasks';
const sinon = require('sinon');

describe('ecs', () => {
    const ecs: any = new ECS();

    describe('listClusters', () => {
        beforeEach(() => {
            this.listClusters = sinon.stub(ecs, 'listClusters').returns(listClusters);
        });

        afterEach(() => {
            this.listClusters.restore();
        });

        it('should list provisioned ECS clusters', async (done) => {
            const response = ecs.listClusters();
            expect(response.clusterArns).toBeDefined();
            expect(response.clusterArns.length).toBeGreaterThan(0);
            done();
        });
    });

    describe('listTasks', () => {
        beforeEach(() => {
            this.listClusters = sinon.stub(ecs, 'listClusters').returns(listClusters);
            this.listTasks = sinon.stub(ecs, 'listTasks').returns(listTasks);
        });

        afterEach(() => {
            this.listClusters.restore();
            this.listTasks.restore();
        });

        it('should list provisioned ECS clusters', async (done) => {
            const response = ecs.listTasks();
            expect(response.taskArns).toBeDefined();
            expect(response.taskArns.length).toBeGreaterThan(0);
            done();
        });
    });
});
