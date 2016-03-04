/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var aws = require('aws-sdk');
var chalk = require('chalk');
var fs = require('fs');
var debug = require('debug')('command:setup');

aws.config.update({
  region: process.env.AWS_REGION || 'eu-west-1'
});

module.exports = setup;

function setup(yargs, argv) {
  var argv2 = yargs
        .usage('Usage: $0 setup -r <role>')
        .option('r', {description: 'role - AWS role ARN for the lambda',
                      type: 'string'})
        .demand('r')
        .option('n', {description: 'interval - run Chaos Llama every N minutes',
                      default: 240,
                      type: 'number'})
        .help('help')
        .argv;

  if (!process.env.AWS_REGION) {
    console.log(chalk.blue('AWS_REGION not set, defaulting to eu-west-1'));
  }

  if (!process.env.AWS_PROFILE) {
    console.log(chalk.red('AWS_PROFILE not set'));
    console.log('Please add AWS IAM user credentials to ~/.aws/credentials and specify the profile to use with the AWS_PROFILE environment variable');
    return;
  }

  var role = argv2.r;

  createLambda(role, function(err, data) {
    if (err) {
      console.log(chalk.red('Something went wrong:'));
      console.log(err);
      return;
    }

    debug(data);
    fs.writeFileSync('llama_config.json',
                     JSON.stringify({
                       FunctionArn: data.FunctionArn
                     }, null, 4));
    console.log(chalk.green('+ Chaos Llama has been created'));
  });
}

function createLambda(role, done) {
  var lambda = new aws.Lambda({apiVersion: '2015-03-31'});

  var params = {
    Code: {
      ZipFile: fs.readFileSync('./lambda/index.js.zip')
    },
    FunctionName: 'chaosLlama',
    Handler: 'index.handler',
    Role: role,
    Runtime: 'nodejs',
    Description: 'Chaos Llama - https://llamajs.com',
    MemorySize: 128,
    Publish: true,
    Timeout: 300
  };

  lambda.createFunction(params, function(err, data) {
    if (err) {
      if (err.code === 'ResourceConflictException' && err.statusCode === 409) {
        console.log('Updating existing lambda definition');
        lambda.updateFunctionCode({
          FunctionName: 'chaosLlama',
          Publish: true,
          ZipFile: fs.readFileSync('./lambda/index.js.zip')
        }, done);
      } else {
        return done(err, null);
      }
    } else {
      return done(null, data);
    }
  });
}
