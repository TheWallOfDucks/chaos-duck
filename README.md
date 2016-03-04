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

## Chaos Llama vs Chaos Monkey

Chaos Llama is inspired by Netflix’s <a href="https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey">Chaos Monkey</a>. Curious about the differences? Here’s a handy summary:

| Llama           | Monkey  |
|:-------------|:-----|
| Serverless (runs on AWS Lambda) - no maintenance | Needs EC2 instances to run on |
| Extremely easy to deploy      | Needs quite a bit of setup and config ([&raquo;&raquo;&raquo;](https://github.com/Netflix/SimianArmy/wiki/Quick-Start-Guide)) |
| Small codebase, easy to understand and extend (<400 SLOC)      | Large codebase (thousands of SLOC) |
| Written in JS | Written in Java |
| New on the scene | Mature project |
| Small featureset | Many features |
| ECS support in the works | Does not support ECS |
| Open source under MPL 2.0 / MIT | Open source under APL 2.0 |
| Developed by [Shoreditch Ops](https://twitter.com/ShoreditchOps) | Developed by Netflix |


## Why Use Chaos Llama?

> Failures happen, and they inevitably happen when least desired. If your application can't tolerate a system failure would you rather find out by being paged at 3am or after you are in the office having already had your morning coffee? Even if you are confident that your architecture can tolerate a system failure, are you sure it will still be able to next week, how about next month? Software is complex and dynamic, that "simple fix" you put in place last week could have undesired consequences. Do your traffic load balancers correctly detect and route requests around system failures? Can you reliably rebuild your systems? Perhaps an engineer "quick patched" a live system last week and forgot to commit the changes to your source repository?

(source: [Chaos Monkey wiki](https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey#why-run-chaos-monkey))

Further reading: [Principles Of Chaos Engineering](http://principlesofchaos.org)


## License

MPL 2.0 - see [LICENSE.txt](./LICENSE.txt) for details.

The [lambda/index.js](./lambda/index.js) file is dual-licensed under MPL 2.0 and MIT and can be used under the terms of either of those licenses.

---

<sub>A project by [Shoreditch Ops](https://twitter.com/ShoreditchOps), creators of [artillery.io](https://artillery.io) - simple &amp; powerful load-testing with Node.js</sub>
