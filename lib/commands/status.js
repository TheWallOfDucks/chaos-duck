/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var aws = require('aws-sdk');
var chalk = require('chalk');
var fs = require('fs');

aws.config.update({
  region: process.env.AWS_REGION || 'eu-west-1'
});

module.exports = activate;

function activate(yargs, argv) {
  if (!process.env.AWS_REGION) {
    console.log(chalk.yellow('AWS_REGION not set, defaulting to eu-west-1'));
  }

  if (!process.env.AWS_PROFILE) {
    console.log(chalk.red('AWS_PROFILE not set'));
    console.log('Please add AWS IAM user credentials to ~/.aws/credentials and specify the profile to use with the AWS_PROFILE environment variable');
    return;
  }

  var cloudwatchevents = new aws.CloudWatchEvents({apiVersion: '2015-10-07'});

  var params = {
    Name: 'chaos_llama_schedule'
  };
  
  if (this.original == 'enable'){
    cloudwatchevents.enableRule(params, function(err, data) {
      if (err) {
        if (err.code === 'ResourceNotFoundException'){
          console.log(chalk.red("Event not found, have you deployed Chaos Llama yet?"))
        } else {
          console.log(chalk.red(err));
        }
      } else {
        console.log(chalk.green("Cloudwatch Event Enabled"));
      }
    });
  } else if (this.original == 'disable') {
    cloudwatchevents.disableRule(params, function(err, data) {
      if (err) {
        if (err.code === 'ResourceNotFoundException'){
          console.log(chalk.red("Event not found, have you deployed Chaos Llama yet?"))
        } else {
          console.log(chalk.red(err));
        }
      } else {
        console.log(chalk.yellow("Cloudwatch Event Disabled"));
      }   
    });
  } else if (this.original == 'status'){
    cloudwatchevents.enableRule(params, function(err, data) {
      if (err) {
        if (err.code === 'ResourceNotFoundException'){
          console.log(chalk.red("Event not found, have you deployed Chaos Llama yet?"))
        } else {
          console.log(chalk.red(err));
        }
      } 
      else {
        console.log(chalk.green("Chaos Llama Status: " + data.State));
      } 
    });
  } else {
    console.log(chalk.yellow("Unrecognized command"));
  }
}
