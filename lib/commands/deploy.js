/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var aws = require('aws-sdk');
var chalk = require('chalk');
var fs = require('fs');
var debug = require('debug')('command:deploy');
var path = require('path');
var tmp = require('tmp');
var util = require('util');
var A = require('async');
var _ = require('lodash');
var archiver = require('archiver');

//This is not ideal but should work for now to seperate deploy vs lambda dependencies
var deployDependencies = ["archiver", "async", "aws-sdk", "chalk",
    "debug", "lodash", "tmp", "yargs"];
var allDependencies = Object.keys(require('./package.json').dependencies);
var lambdaDependencies = _.difference(allDependencies, deployDependencies);

aws.config.update({
  region: process.env.AWS_REGION || 'eu-west-1'
});

module.exports = deploy;

function deploy(yargs, argv) {
  var argv2 = yargs
        .usage('Usage: $0 deploy [options]')
        .option('r', {
          description: 'role - AWS role ARN for the lambda',
          type: 'string'
        })
        .option('c', {
          description: 'config - path to Llamafile configuration file',
          type: 'string'
        })
        .help('help')
        .argv;

  if (!process.env.AWS_REGION) {
    console.log(chalk.yellow('AWS_REGION not set, defaulting to eu-west-1'));
  }

  if (!process.env.AWS_PROFILE) {
    console.log(chalk.red('AWS_PROFILE not set'));
    console.log('Please add AWS IAM user credentials to ~/.aws/credentials and specify the profile to use with the AWS_PROFILE environment variable');
    return;
  }

  var role;
  if (argv2.r) {
    role = argv2.r;
  } else {
    try {
      var llamaConfig = JSON.parse(fs.readFileSync('./llama_config.json', 'utf8'));
      role = llamaConfig.LambdaRoleArn;
    } catch (err) {
      console.log(chalk.red('config_llama.json not found'), '- please specify the lambda role ARN to use with -r');
      return;
    }
  }

  var llamaFile = null;
  if (argv2.c) {
    try {
      llamaFile = JSON.parse(fs.readFileSync(argv2.c), 'utf8');
    } catch (err) {
      console.log(chalk.red(util.format('%s could not be read', argv2.c)));
      return;
    }
  }

  createLambda(role, llamaFile, function(err, data) {
    if (err) {
      console.log(chalk.red('Something went wrong:'));
      console.log(err);
      return;
    }

    debug(data);
    fs.writeFileSync('llama_config.json',
                     JSON.stringify({
                       FunctionArn: data.FunctionArn,
                       LambdaRoleArn: role
                     }, null, 4));
    console.log(chalk.green('+ Chaos Llama has been created'));

    if (llamaFile) {
      var interval = llamaFile.interval || 60;
      configSchedule(interval, llamaConfig.FunctionArn, function(err) {
        if (err) {
          console.log(chalk.red('Oops, something went wrong'));
          console.log(err);
          return;
        }

        console.log(chalk.green(util.format('+ Chaos Llama\'s schedule updated to once every %s minutes', interval)));
      });
    }
  });
}

function createLambda(role, llamaFile, done) {
  var lambda = new aws.Lambda({apiVersion: '2015-03-31'});

  var archive = archiver.create('zip', {}); 

  var lambdaPath = path.join(__dirname, '../../lambda/index.js');
  var tmpf = tmp.fileSync();
  archive.pipe(fs.createWriteStream(tmpf.name));
  archive.append(fs.readFileSync(lambdaPath), { name: 'index.js' });
  if (llamaFile) {
    debug('Adding real Llamafile to lambda zip');
    llamaFile.region = process.env.AWS_REGION; // FIXME
    archive.append(new Buffer(JSON.stringify(llamaFile)), { name: 'config.json' });
  } else {
    debug('Adding a stub Llamafile to lambda zip');
    archive.append(new Buffer(JSON.stringify({enableForASGs: []})), { name: 'config.json' });
  }
  lambdaDependencies.forEach( function (moduleName){
    archive.directory('./node_modules/' + moduleName, 'node_modules/'+ moduleName);
  })
  archive.finalize();

  archive.on('error', function(err) {
    console.log('error');
    throw err;
  });

  debug('Zip file written to %s', tmpf.name);

  var params = {
    Code: {
      ZipFile: fs.readFileSync(tmpf.name)
    },
    FunctionName: 'chaosLlama',
    Handler: 'index.handler',
    Role: role,
    Runtime: 'nodejs',
    Description: 'Chaos Llama - http://llamajs.com',
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
          ZipFile: fs.readFileSync(tmpf.name)
        }, done);
      } else {
        return done(err, null);
      }
    } else {
      return done(null, data);
    }
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
    Description: 'Schedule for invoking Chaos Llama - http://llamajs.com',
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
