# chaos-duck 🦆

## Description

Chaos Duck is a Node.js serverless implementation of [Netflix's Chaos Monkey](https://github.com/Netflix/chaosmonkey). Chaos Duck will randomly stop and failover resources in your AWS account allowing you to test and build highly available applications.

## Table of Contents
- [How it works](#how-it-works)
- [Supported Services](#supported-services)
- [Quick start](#quick-start)
- [Using duck.json](#using-duck.json)
- [Using CLI Options](#using-cli-options)
- [Using HTTP POST](#using-http-post)
- [Contributing](CONTRIBUTING.md)

### How it works

Chaos Duck will randomly choose from the services you provide and perform a single chaotic action to the chosen service. To cause more chaos, simply invoke Chaos Duck again. If no services are explicitly specified in the POST body, all supported services will be considered fair game.

### Supported services

These are the curent supported AWS services to wreak havoc on. Choose wisely.

- EC2: Chaos Duck will randomly stop your EC2 instances
- ECS: Chaos Duck will randomly stop your ECS tasks
- ElastiCache: Chaos Duck will randomly failover your ElastiCache instance

### Quick start

Before getting started make sure you have [Node.js](https://nodejs.org) and [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) installed. Once you have set that up, make sure you have the following information from your AWS account: account number and role to assume to deploy lambda

1. Clone the project and install all dependencies

        npm install

2. Create a symlink to enable the `chaos-duck` command globally

        npm run link

3. Follow the prompts in order to configure Chaos Duck

        chaos-duck config

4. Once you are done with the configuration, a `duck.json` config file will be created (or modified) for you in your current directory

    ```json
    {
        "environment": "sandbox",
        "account": "12345678912",
        "role": "Sandbox-Developer",
        "profile": "default",
        "stage": "dev"
    }
    ```

5. Deploy Chaos Duck

        chaos-duck deploy -c duck.json

    NOTE: Once Chaos Duck has been deployed your `duck.json` file will be updated to include your `chaosUrl`

5. To begin wreaking chaos, simply invoke it

        chaos-duck invoke -c duck.json

6. To undeploy

        chaos-duck undeploy -c duck.json

### Using duck.json

In addition to using CLI options, you can also `deploy` or `invoke` by providing the path to a `duck.json` config file. To generate a new `duck.json` file, simply run: 

```sh
chaos-duck config
```

Supported properties

- `account`: AWS account number
- `chaosUrl`: The url to call when invoking Chaos Duck
    - This value will be ignored during deployments
- `environment`: Environment name. Can be any string used by you to identify an environment
- `profile`: Profile in your AWS .credentials file to use. Defaults to "default"
- `role`: AWS role to assume during deploy. Whatever profile you specify needs to have access to assume this role
- `schedule`: The schedule to run Chaos Duck. Defaults to no schedule
    - This value is expressed as a value which can be a positive integer along with a unit which can be `minute(s)`, `hour(s)`, or `day(s)`
        - For a singular value the unit must be singular (`'1 day'`), otherwise plural (`'5 days'`)
- `services`: Comma separated service values to invoke chaos on. Defaults to all services
    - These values are not case sensitive
- `slackWebhookUrl`: Slack webhook url to post notifications to
- `stage`: Deployment stage in AWS. Defaults to "dev"

Example

```json
{
    "account": "12345678912",
    "chaosUrl": "https://oxabydb5z8.execute-api.us-east-1.amazonaws.com/dev/chaos",
    "environment": "sandbox",
    "profile": "default",
    "role": "Sandbox-Developer",
    "schedule": "1 hour",
    "services": "ECS,EC2,ElastiCache",
    "slackWebhookUrl": "https://hooks.slack.com/services/ABCDE123/FGHIJK456/laduhgfa98u234234",
    "stage": "dev"
}
```

### Using CLI Options

`chaos-duck --help`

```sh
Usage: chaos-duck [options] [command]

Chaos Duck 🦆

Options:
  -v, --version         output the version number
  -h, --help            output usage information

Commands:
  config|c              Setup Chaos Duck
  deploy|d [options]    Deploy Chaos Duck
  invoke|i [options]    Unleash Chaos Duck
  undeploy|u [options]  Undeploy Chaos Duck
```

### Using HTTP POST

```js
POST <chaosUrl>

{
    "services": ["ECS", "ElastiCache"]
}
```

Note: the `<chaosUrl>` can be found in your `duck.json` file