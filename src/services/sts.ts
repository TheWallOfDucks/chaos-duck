import { STS as sdk, AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

export class STS {
    private sts: sdk;

    constructor() {
        this.sts = new sdk();
    }

    /**
     * @description Assumes a role in a given account
     * @param {string} account
     * @param {string} role
     * @returns {sdk.AssumeRoleResponse}
     */
    async assumeRole(account: string, role: string): Promise<PromiseResult<sdk.AssumeRoleResponse, AWSError>> {
        try {
            const assumeRole = this.sts.assumeRole({ RoleArn: `arn:aws:iam::${account}:role/${role}`, RoleSessionName: 'chaos-duck' }).promise();
            return await assumeRole;
        } catch (error) {
            throw new Error(error);
        }
    }
}
