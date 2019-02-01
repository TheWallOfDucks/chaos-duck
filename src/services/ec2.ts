import { EC2 as sdk } from 'aws-sdk';
import { Utility } from '../classes/utility';
import { chaosFunction } from '../decorators/chaosFunction';

/**
 * @description EC2 service class
 */
export class EC2 {
    private ec2: sdk;

    constructor() {
        this.ec2 = new sdk();
    }

    private async describeInstances() {
        try {
            const describeInstances = this.ec2.describeInstances({}).promise();
            return await describeInstances;
        } catch (error) {
            throw new Error(error);
        }
    }

    private async stopInstances(InstanceIds: string[]) {
        try {
            const stopInstances = this.ec2.stopInstances({ InstanceIds }).promise();
            return await stopInstances;
        } catch (error) {
            throw new Error(error);
        }
    }

    @chaosFunction()
    async stopRandomEC2Instance() {
        try {
            const instances = await this.describeInstances();
            const reservation: sdk.Reservation = Utility.getRandom(instances.Reservations);
            const instance: sdk.Instance = Utility.getRandom(reservation.Instances);

            return this.stopInstances([instance.InstanceId]);
        } catch (error) {
            return error.message;
        }
    }
}
