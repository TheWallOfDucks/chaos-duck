import { SSM as sdk } from 'aws-sdk';

export class SSM {
    private ssm: sdk;
    private _environmentName: string;

    constructor() {
        this.ssm = new sdk();
    }

    get environmentName() {
        return this._environmentName;
    }

    set environmentName(value: string) {
        this._environmentName = value;
    }

    async setEnvironmentName() {
        try {
            const environmentName = this.ssm.getParameter({ Name: '/environment/name' }).promise();
            const response = await environmentName;

            if (response.Parameter && response.Parameter.Value) {
                this.environmentName = response.Parameter.Value;
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}
