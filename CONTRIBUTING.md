# Contributing to chaos-duck 🦆

## Table of Contents

-   [Making a Pull Request](#making-a-pull-request)
-   [Reporting a bug](#reporting-a-bug)
-   [Development](#development)
    -   [Decorators](#decorators)
    -   [How to add a new Service](#how-to-add-a-new-service)
    -   [How to add a new Notification Provider](#how-to-add-a-new-notification-provider)
    -   [How to debug](#how-to-debug)
-   [TODO](#todo)

## Making a Pull Request

1. All code should be written in TypeScript following patterns demonstrated in the existing codebase. Don't be a hero.
2. Do all work in your local forked branch and then make a pull request to the `master` branch
3. Add me to all pull requests: caleb.duckwall@apiture.com
4. Make sure all `pre-push` hooks are passing. Basically, your code should compile.
5. Be sure your changes are tested and do not break the project for others.
6. All new files added should have a one line description indicating the purpose.
7. All changes should be commented or clear enough to decipher by looking at the code.
8. All changes should follow the existing code style (indentation, use of braces, white space, capitalization, variable naming etc.). Do no reformat source code using a different style.
9. If you are completing an item from [TODO](#todo) then remove it from the list.
10. Finally, update the package version and [README.md](README.md) appropriately. [Read this](https://docs.npmjs.com/about-semantic-versioning) for more information on semantic versioning.

## Reporting a Bug

-   If reporting a security bug, [email me directly](mailto:caleb.duckwall@apiture.com)
-   If not reporting a security bug, make sure you provide the following information in your bug report:
    -   What version of Node are you using?
    -   What version of TypeScript are you using?
    -   What operating system are you using?
    -   What did you do?
    -   What happened?
    -   What did you expect to happen?

## Development

### Decorators

> What are decorators?

Glad you asked. Read [this](https://www.typescriptlang.org/docs/handbook/decorators.html).

> How are decorators being used in this project?

Decorators in this project are being used as a sort of run time discovery method. So at run time, chaos-duck builds a map of the different services and their available chaos functions. This allows chaos-duck to randomly choose a service and a method to call.

> Does order matter when you have a method with multiple decorators?

YES.

    The expressions for each decorator are evaluated top-to-bottom. The results are then called as functions from bottom-to-top.

This means that in this method:

```ts
@chaosFunction()
@disabled()
async stopRandomInstance() {
    ...
}
```

`@chaosFunction` is evaluated before `@disabled`, but `@disabled` is actually executed first.

### How to add a new Service

1. Begin by creating a new `<service>.ts` file in `src/services`
2. Make sure the lambda has the correct permissions to interact with the service in `serverless.yaml`
3. Begin by stubbing out the class. See below as an example for what you would do if your service was `EC2`

```typescript
// src/services/ec2.ts
import { EC2 as sdk } from 'aws-sdk';
import { Utility } from '../classes/utility';
import { chaosFunction } from '../decorators/chaosFunction';

/**
 * @description EC2 service class
 */
export class EC2 {
    private ec2: sdk;

    constructor() {
        this.ec2 = new sdk();
    }
}
```

4. Once you have stubbed out your class you can start creating your `chaosFunction`. This function should:
    - Perform a single, specific, function
    - Be named descriptively
    - Should be as random as possible
    - Not rely on any parameters to be passed in
    - Should be decorated with [`@chaosFunction()`](#markdown-header-decorators)
5. Once you have built your `chaosFunction` make sure that it is exposed through the class (i.e. not private). Make sure all helper methods/properties in the class are private...we only want to expose the `chaosFunctions`
6. Add service to `src/classes/chaos.ts`
    - This is where the mapping between the service names and the classes happens
    - Getters and setters for services are case sensitive and should be lowercase
7. Add slack notification support to `src/notification_providers/slack.ts`
8. Add service to `src/config/supportedServices.ts`

### How to add a new Notification Provider

1. Begin by creating a new `<notificationProvider>.ts` file in `src/notification_providers`
2. ...the rest is pretty much up to you, take a look at `src/notification_provider/slack.ts`. Here are some guidelines:
    - Should have a method called `send` that should accept a message body
    - Should support all the different services and chaos functions
    - Should not be disruptive. (i.e. it should not break anything if you don't use that notification provider)
3. Implement the notification provider in `src/classes/notification.ts`, again following the `slack` implementation as an example

### How to Debug

> I've made a change, now how do I test it?

1. Re-build the source with your change
    - `npm run link`
2. Deploy your changes to your AWS account
    - If you already have a `duck.json` file then run `chaos-duck deploy`
    - If you don't have a `duck.json` file then run `chaos-duck config`, follow then prompts, then run `chaos-duck deploy`
3. Once your deployment is complete, login to the AWS console for your account
4. From the AWS services page, select Lambda
5. Filter for `chaos` and you should see your function. Click on the function name to go to your function
6. Switch to the monitoring tab
7. Click "View logs in CloudWatch"
8. Open the CloudWatch log corresponding to the correct event time
9. In the CloudWatch log you should be all `console.log`'s that have been added to the code

### TODO

-   Add ability to support cron schedule rate
-   Add ability to support multiple "to" email addresses
