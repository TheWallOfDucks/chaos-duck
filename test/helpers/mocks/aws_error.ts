import { AWSError } from 'aws-sdk';
import * as faker from 'faker';

export const error: AWSError = {
    code: faker.hacker.noun(),
    message: faker.hacker.phrase(),
    retryable: false,
    statusCode: 400,
    time: new Date(),
    hostname: faker.internet.domainName(),
    region: 'us-east-1',
    retryDelay: 0,
    requestId: 'f83184ef',
    extendedRequestId: 'f83184ef-d1ca-4268-bb15-339bfeecc4ed',
    cfId: 'acd49d3a-ad70-4968-97e2-d77b8ad2f981',
    name: faker.hacker.phrase(),
};
