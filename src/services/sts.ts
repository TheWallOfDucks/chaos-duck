import { STS as sdk } from 'aws-sdk';

export class STS {
    private sts: sdk;

    constructor() {
        this.sts = new sdk();
    }

    async assumeRole(account: string, role: string) {
        try {
            const assumeRole = this.sts.assumeRole({ RoleArn: `arn:aws:iam::${account}:role/${role}`, RoleSessionName: 'chaos-duck' }).promise();
            return await assumeRole;
        } catch (error) {
            throw new Error(error);
        }
    }
}
