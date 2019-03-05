import { S3 as sdk } from 'aws-sdk';
import { IChaosResponse } from '../classes/chaos';

const qs = require('querystring');

export class S3 {
    private s3: sdk;
    private bucket: string;

    constructor() {
        this.s3 = new sdk();
        this.bucket = process.env.RESULTS_BUCKET;
    }

    /**
     * @description Uploads response to results bucket
     * @param {IChaosResponse} result
     * @returns {sdk.ManagedUpload.SendData}
     */
    async uploadResult(result: IChaosResponse): Promise<sdk.ManagedUpload.SendData> {
        try {
            const uploadResult = this.s3
                .upload({
                    Body: JSON.stringify(result, null, 2),
                    Bucket: this.bucket,
                    Key: `${result.service}-${result.action}-${new Date().toISOString()}.json`,
                    ACL: 'public-read',
                    Tagging: qs.stringify({ 'chaos-duck': true }),
                    ContentType: 'application/json',
                })
                .promise();
            return await uploadResult;
        } catch (error) {
            throw new Error(error);
        }
    }
}
