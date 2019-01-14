# chaos-duck 🦆

## Description

Chaos Duck is a serverless implementation of [Netflix's Chaos Monkey](https://github.com/Netflix/chaosmonkey). Chaos Duck will randomly stop and failover resources in your AWS account allowing you to test and build highly available applications.

## Quickstart

Before getting started make sure you have [Node.js](https://nodejs.org) and [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) installed. Once you have set that up, make sure you have the following information from your AWS account:

- Account number
- Role that can be assumed and has access to deploy lambda

1. Clone the project and install all dependencies

        npm install

2. Create a symlink to enable the `chaos-duck` command globally

        npm link

3. Deploy to your account

        chaos-duck deploy -e <name of environment> -a <account> -r <role>

    Example:

        chaos-duck deploy -e sandbox -a 12345678912 -r Sandbox-Developer

4. Once deployed, you will see your chaos url in the output, surrounded by 🦆🦆

        ...
        Stack Outputs
        🦆🦆 ServiceEndpoint: https://abcdef123.execute-api.us-east-1.amazonaws.com/dev/chaos 🦆🦆
        ...

5. To begin wreaking chaos, simply invoke it

        chaos-duck invoke -u <chaos url> -s <services>

    Example:

        chaos-duck invoke -u https://abcdef123.execute-api.us-east-1.amazonaws.com/dev/chaos -s ecs,elasticache

    Note: You can also invoke your chaos ducks by doing a POST to your chaos url

        POST https://abcdef123.execute-api.us-east-1.amazonaws.com/dev/chaos

    ```json
    {
        "services": ["ecs", "elasticache"]
    }
    ```

6. To undeploy chaos duck run `npm run undeploy`

## How it works

Chaos Duck will randomly choose from the services you provide and perform a single chaotic action to the chosen service. To cause more chaos, simply call the lambda again. If no services are explicitly specified in the POST body, all supported services will be considered fair game.

## Supported services

- EC2: Chaos Duck will randomly stop your EC2 instances
- ECS: Chaos Duck will randomly stop your ECS tasks
- ElastiCache: Chaos Duck will randomly failover your ElastiCache instance

## Slack integration

To allow chaos duck to post notifications on Slack, simply create a `.env` in the root of your project directory and add:

```text
SLACK_WEBHOOK_URL=<your unique webhook url>
```

NOTE: If you already deployed the chaos lambda, you will need to redeploy for Slack notifications to be enabled

## Using duck.json

You can also deploy by providing the path to a `duck.json` config file

```sh
# This would be an example of the duck.json existing in your current working directory
chaos-duck deploy -c duck.json
```

```json
{
    "environment": "sandbox",
    "account": "12345678912",
    "role": "Sandbox-Developer",
    "profile": "default",
    "stage": "dev",
    "slackWebhookUrl": "https://hooks.slack.com/services/ABCDEFG/ABCDEFG123/adsfadsfadsfadsf"
}
```