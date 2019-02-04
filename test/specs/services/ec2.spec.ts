import { EC2 } from '../../../src/services/ec2';
import { describeInstances } from '../../config/mocks/ec2/describeInstances';
import { stopInstances } from '../../config/mocks/ec2/stopInstances';
const sinon = require('sinon');

describe('ec2', () => {
    const ec2 = new EC2();

    describe('describeInstances', () => {
        beforeEach(() => {
            this.describeInstances = sinon.stub(ec2, <any>'describeInstances').returns(describeInstances);
        });

        afterEach(() => {
            this.describeInstances.restore();
        });

        it('should describe provisioned EC2 instances', async (done) => {
            const response = await this.describeInstances();
            expect(response.Reservations).toBeDefined();
            expect(response.Reservations.length).toBeGreaterThan(0);
            done();
        });
    });

    describe('stopInstances', () => {
        beforeEach(() => {
            this.describeInstances = sinon.stub(ec2, <any>'describeInstances').returns(describeInstances);
            this.stopInstances = sinon.stub(ec2, <any>'stopInstances').returns(stopInstances);
        });

        afterEach(() => {
            this.describeInstances.restore();
            this.stopInstances.restore();
        });

        it('should describe provisioned EC2 instances', async (done) => {
            const response = await this.stopInstances();
            expect(response.StoppingInstances).toBeDefined();
            expect(response.StoppingInstances.length).toBeGreaterThan(0);
            expect(response.StoppingInstances[0].CurrentState.Name).toBe('stopping');
            done();
        });
    });

    describe('stopRandomEC2Instance', () => {
        beforeEach(() => {
            this.describeInstances = sinon.stub(ec2, <any>'describeInstances').returns(describeInstances);
            this.stopInstances = sinon.stub(ec2, <any>'stopInstances').returns(stopInstances);
        });

        afterEach(() => {
            this.describeInstances.restore();
            this.stopInstances.restore();
        });

        it('should stop a random EC2 instance', async (done) => {
            const response = await ec2.stopRandomEC2Instance();
            expect(response.StoppingInstances).toBeDefined();
            expect(response.StoppingInstances.length).toBeGreaterThan(0);
            expect(response.StoppingInstances[0].CurrentState.Name).toBe('stopping');
            done();
        });
    });
});
