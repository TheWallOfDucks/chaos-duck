const { series } = require('gulp');
const { execSync } = require('child_process');
const options = require('minimist')(process.argv.slice(2));

const generateAWSCredentials = () => {
    const result = execSync(`aws sts assume-role --profile ${options.profile} --role-arn arn:aws:iam::${options.account}:role/${options.role} --role-session-name chaos-duck`);
    const credentials = JSON.parse(result.toString());

    process.env.AWS_ACCESS_KEY_ID = credentials.Credentials.AccessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = credentials.Credentials.SecretAccessKey;
    process.env.AWS_SESSION_TOKEN = credentials.Credentials.SessionToken;
    process.env.AWS_ENV = options.environment;

    return Promise.resolve(credentials);
};

const serverlessDeploy = () => {
    const result = execSync('node --max-old-space-size=10024 node_modules/.bin/serverless deploy --verbose', { stdio: 'inherit' });
    return Promise.resolve(result);
};

const undeploy = () => {
    const result = execSync(`node_modules/.bin/serverless remove --environment ${options.environment} --stage ${options.stage}`, { stdio: 'inherit' });
    return Promise.resolve(result);
};

exports.deploy = series(generateAWSCredentials, serverlessDeploy);
exports.undeploy = undeploy;
