import { IAM as sdk } from 'aws-sdk';

export class IAM {
    private iam: sdk;

    constructor() {
        this.iam = new sdk();
    }

    async listAccountAliases() {
        try {
            const listAccountAliases = this.iam.listAccountAliases().promise();
            return await listAccountAliases;
        } catch (error) {
            throw new Error(error);
        }
    }
}
