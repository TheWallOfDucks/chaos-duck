import { IAM as sdk, AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

export class IAM {
    private iam: sdk;

    constructor() {
        this.iam = new sdk();
    }
    /**
     * @description Lists account alias for the given account
     * @returns {sdk.ListAccountAliasesResponse}
     */
    async listAccountAliases(): Promise<PromiseResult<sdk.ListAccountAliasesResponse, AWSError>> {
        try {
            const listAccountAliases = this.iam.listAccountAliases().promise();
            return await listAccountAliases;
        } catch (error) {
            throw new Error(error);
        }
    }
}
