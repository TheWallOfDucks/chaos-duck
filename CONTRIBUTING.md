# Contributing to chaos-duck 🦆

## Table of Contents

-   [Making a Pull Request](#markdown-header-making-a-pull-request)

-   [Development](#markdown-header-development)

    -   [Decorators](#markdown-header-decorators)

    -   [How to add a new Service](#markdown-header-how-to-add-a-new-service)

    -   [How to add a new Notification Provider](#markdown-header-how-to-add-a-new-notification-provider)

## Making a Pull Request

1. Do all work in your local forked branch and then make a pull request to the `master` branch
2. Add me to all pull requests: caleb.duckwall@apiture.com
3. Make sure all `pre-push` hooks are passing. Basically, your code should compile.
4. All new files added should have a one line description indicating the purpose.
5. Intention of all changes should be described or clear enough to decipher by looking at the code.

## Development

### Decorators

> What are decorators?

Glad you asked. Read [this](https://www.typescriptlang.org/docs/handbook/decorators.html).

> How are decorators being used in this project?

Decorators in this project are being used as a sort of run time discovery method. So at run time, chaos-duck builds a map of the different services and their available chaos functions. This allows chaos-duck to randomly choose a service and a method to call.

> Does order matter when you have a method with multiple decorators?

YES.

    The expressions for each decorator are evaluated top-to-bottom. The results are then called as functions from bottom-to-top.

This means that in this method

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
2. Begin by stubbing out the class. See below as an example for what you would do if your service was `EC2`

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

3. Once you have stubbed out your class you can start creating your `chaosFunction`. This function should:
    - Perform a single, specific, function
    - Be named descriptively
    - Should be as random as possible
    - Not rely on any parameters to be passed in
    - Should be decorated with [`@chaosFunction()`](#markdown-header-decorators)
4. Once you have built your `chaosFunction` make sure that it is exposed through the class (IE not private). Make sure all helper methods/properties in the class are private...we only want to expose the `chaosFunctions`
5. Add service to `src/classes/chaos.ts`
6. Add slack notification support to `src/notification_providers/slack.ts`

### How to add a new Notification Provider

1. Begin by creating a new `<notificationProvider>.ts` file in `src/notification_providers`
2. ...the rest is pretty much up to you, take a look at `src/notification_provider/slack.ts`. Here are some guidelines:
    - Should have a method called `post` that should accept a message body
    - Should support all the different services and chaos functions
    - Should not be disruptive. (IE it should not break anything if you don't use that notification provider)
3. Implement the notification provider in `src/classes/notification.ts`, again following the `slack` implementation as an example
