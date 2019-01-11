# chaos-duck

## Description

Chaos Duck is a serverless implementation of [Netflix's Chaos Monkey](https://github.com/Netflix/chaosmonkey). Chaos duck will randomly stop and failover resources in your AWS account allowing you to test and build highly available applications.

## Quickstart

1. Clone the project and run `npm i`
2. Modify `config` object in `package.json` with your AWS account number and a role in that account that you have permissions to assume
3. Deploy to your account using `npm run deploy`
4. Once deployed, you should see your chaos endpoint in the output. Something like `https://abc123.execute-api.us-east-1.amazonaws.com/dev/chaos`
5. To begin wreaking chaos, simply POST to your chaos endpoint
6. To undeploy chaos duck run `npm run undeploy`

## How it works

Chaos Duck will randomly choose from the services you provide in your POST and perform a single chaotic action to the chosen service. To cause more chaos, simply call the lambda again. If no services are explicitly specified in the POST body, all supported services will be considered fair game.

## Supported services

- ECS: Chaos Duck will randomly stop your ECS tasks
- ElastiCache: Chaos Duck will randomly failover your ElastiCache instance

## Current environments

- `open-sandbox`: `https://uoagwm5f37.execute-api.us-east-1.amazonaws.com/dev/chaos`
- `open-integration`: `https://vygdzofpbg.execute-api.us-east-1.amazonaws.com/dev/chaos`
- `open-production`: `https://bykbvc9pti.execute-api.us-east-1.amazonaws.com/dev/chaos`

## Slack integration

To allow chaos duck to post notifications on Slack, simply create a `.env` in the root of your project directory and add:

```text
SLACK_WEBHOOK_URL=<your unique webhook url>
```

NOTE: If you already deployed the chaos lambda, you will need to redeploy for Slack notifications to be enabled

## Example request

POST /chaos

```json
{
    "services": ["ecs", "elasticache"]
}
```
