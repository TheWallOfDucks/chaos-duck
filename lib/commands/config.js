/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var aws = require('aws-sdk');
var chalk = require('chalk');
var fs = require('fs');
var A = require('async');
var debug = require('debug')('command:config');
var util = require('util');

module.exports = config;

var llamaConfig;

function config(yargs, argv) {
  var argv2 = yargs
        .usage('Usage: $0 config [options]')
        .option('i', {
          description: 'interval - amount of time between each Chaos Llama run (in minutes)',
          default: 240,
          type: 'number'
        })
        .help('help')
        .argv;

  var interval = argv2.i;

  try {
    llamaConfig = JSON.parse(fs.readFileSync('./llama_config.json', 'utf8'));
  } catch (err) {
    console.log(chalk.red('config_llama.json not found'), '- did you run "llama setup" first?');
    return;
  }

  configSchedule(interval, llamaConfig.FunctionArn, function(err) {
    if (err) {
      console.log(chalk.red('Oops, something went wrong'));
      console.log(err);
      return;
    }

    console.log(chalk.green(util.format('+ Chaos Llama\'s schedule updated to once every %s minutes', interval)));
  });
}


function configSchedule(interval, functionArn, done) {
  A.waterfall(
    [
      A.constant({interval: interval}),
      createEventRule,
      addLambdaPermission,
      connectRuleToLambda
    ],
    function(err, result) {
      done(err, result);
    });
}

function createEventRule(context, next) {
  var events = new aws.CloudWatchEvents({apiVersion: '2014-02-03'});

  debug(context);

  var params = {
    Name: 'chaos_llama_schedule',
    Description: 'Schedule for invoking Chaos Llama - https://llamajs.com',
    ScheduleExpression: 'rate(' + context.interval + ' minutes)',
    State: 'ENABLED'
  };

  events.putRule(params, function(err, data) {
    if (err) {
      return next(err, context);
    }

    context.RuleArn = data.RuleArn;
    debug('event rule created/updated, arn = %s', context.RuleArn);
    return next(null, context);
  });
}

function addLambdaPermission(context, next) {
  var lambda = new aws.Lambda({apiVersion: '2015-03-31'});

  debug(context);

  // TODO: Remove the statement or make unique with Date.now
  var params = {
    FunctionName: 'chaosLlama',
    StatementId: 'chaosLlamaStatement',
    Action: 'lambda:InvokeFunction',
    Principal: 'events.amazonaws.com',
    SourceArn: context.RuleArn
  };

  lambda.addPermission(params, function (err, data) {
    if (err) {
      return next(err, context);
    }

    context.FunctionArn = JSON.parse(data.Statement).Resource;
    debug('permission added for resource = %s', context.FunctionArn);
    return next(null, context);
  });
}

function connectRuleToLambda(context, next) {
  var events = new aws.CloudWatchEvents({apiVersion: '2014-02-03'});

  debug(context);

  var params = {
    Rule: 'chaos_llama_schedule',
    Targets: [{
      Id: '1',
      Arn: context.FunctionArn
    }]
  };

  events.putTargets(params, function(err, data) {
    if (err) {
      return next(err, context);
    }

    return next(null, context);
  });
}
