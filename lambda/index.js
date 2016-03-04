// This file is dual-licensed under MPL 2.0 and MIT - you can use the source form
// provided under the terms of either of those licenses.

var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';

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

    var numInstances = data.Reservations.length;

    var random = Math.floor(Math.random() * numInstances);
    var target = data.Reservations[random].Instances[0];

    console.log('Going to terminate instance with id = %s', target.InstanceId);

    ec2.terminateInstances({InstanceIds:[target.InstanceId]}, function(err, data) {
      if (err) {
        return context.done(err, null);
      }

      console.log('Instance %s terminated', target.InstanceId);
      return context.done(null, data);
    });
  });
};
