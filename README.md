```
                   V
                  /'>>>
                 /*/
                / /
               /*/
              / /
      -------/*/   _____ _____ _____ _____ _____    __    __    _____ _____ _____
   --/  *  * */   |     |  |  |  _  |     |   __|  |  |  |  |  |  _  |     |  _  |
    /* * *  */    |   --|     |     |  |  |__   |  |  |__|  |__|     | | | |     |
    -  --- -/     |_____|__|__|__|__|_____|_____|  |_____|_____|__|__|_|_|_|__|__|
     H    H
     H    H
     --   --
```

- **Website**: [https://llamajs.com](https://llamajs.com)
- **Source**: [https://github.com/hassy/llama-cli](https://github.com/hassy/llama-cli)
- **Issues**: [https://github.com/hassy/llama-cli/issues](https://github.com/hassy/llama-cli/issues)
- **Twitter**: [@hveldstra](https://twitter.com/hveldstra)

# Meet Chaos Llama

Chaos Llama is a small tool for testing resiliency and recoverability of AWS-based architectures.  Once configured and deployed, it will randomly terminate or otherwise interfere with the operation of your EC2 instances and ECS tasks. It is inspired by Netflix's [Chaos Monkey](https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey).

## Installation

```shell
npm install -g llama-cli
```

## Setting Up
### AWS Configuration

An IAM user and a role for the lambda need to be set up first.

#### IAM User

Must be set up and credentials set up in `~/.aws/credentials`

#### Lambda Role

Required policies:
- AmazonEC2FullAccess

### Setting up Chaos Llama

```shell
llama setup -r $lambda-role-arn
llama config -i 240
```

## Current Limitations

Chaos Llama will only work in these regions (due to a limitation with AWS Lambda Schedules):

- US East (Northern Virginia)
- US West (Oregon)
- Europe (Ireland)
- Asia Pacific (Tokyo)

## License

MPL 2.0 - see [LICENSE.txt](./LICENSE.txt) for details.

The [lambda/index.js](./lambda/index.js) file is dual-licensed under MPL 2.0 and MIT and can be used under the terms of either of those licenses.

