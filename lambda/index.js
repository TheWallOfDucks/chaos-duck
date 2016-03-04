// This file is dual-licensed under MPL 2.0 and MIT - you can use the source form
// provided under the terms of either of those licenses.

var AWS = require('aws-sdk');
var llamaConfig = require('./config.json');

AWS.config.region = llamaConfig.region || 'eu-west-1';

exports.handler = function(event, context) {
console.log('Chaos Llama starting up');
var ec2 = new AWS.EC2();

ec2.describeInstances(function(err, data) {
  if (err) {
    return context.done(err, null);
  }

  if (!data || data.Reservations.length === 0) {
    console.log('No instances found, exiting.');
    return context.done(null, null);
  }

  var candidates = [];
  data.Reservations.forEach(function(res) {
    res.Instances.forEach(function(inst) {
      inst.Tags.forEach(function(tag) {
        if (tag.Key === 'aws:autoscaling:groupName') {
          // this instance is in an ASG
          if (llamaConfig.enableForASGs) {
            // this takes precedence - if defined we don't even look at disableForASGs
            if (llamaConfig.enableForASGs.indexOf(tag.Value) !== -1) {
              candidates.push(inst);
            }
          } else {
            if (llamaConfig.disableForASGs) {
              if (llamaConfig.disableForASGs.indexOf(tag.Value) === -1) {
                candidates.push(inst);
              }
            }
          }
        }
      });
    });
  });

  console.log('candidates: %j', candidates);
  var numInstances = candidates.length;

  if (numInstances === 0) {
    console.log('No suitable instances found');
    return context.done(null);
  }

  var random = Math.floor(Math.random() * numInstances);
  var target = candidates[random];

  console.log('Going to terminate instance with id = %s', target.InstanceId);

  return context.done(null);

  ec2.terminateInstances({InstanceIds:[target.InstanceId]}, function(err, data) {
    if (err) {
      return context.done(err, null);
    }

    console.log('Instance %s terminated', target.InstanceId);
    return context.done(null, data);
  });
});
};
