var SensorsAnalytics = require('../src/index.js').SensorsAnalytics;
var Submitter = require('../src/index').Submitter;
var ram = require('ramda');
var moment = require('moment');
var sa = new SensorsAnalytics;
var url = 'http://10.10.11.209:8006/sa?token=251b8f7d3f08d0b0';
// Basic Usage
 sa.submitTo(url, {
     mode: 'track',
     timeout: 10 * 1000
 });
var id = 'test';
sa.trackSignup(id, 'node/node');
sa.profileSet(id, { age: 18, name: '小四', gender: 'female' })
sa.track(id, 'task', {
  cname: '测试',
  lib: 'Node',
  version: '0.10.35'
});

// Super Properties that assigned to every event tracking
sa.registerSuperProperties({
    $appVersion: '1.0.0',
    env: 'production'
});

// Track event
sa.track('12345', 'userHappy');

// Track event with custom properties
sa.track('12345', 'newOrder', {
   orderId: '12345'
});

// Track event with specific time

