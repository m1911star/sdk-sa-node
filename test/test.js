var SensorsAnalytics = require('../src/index.js').SensorsAnalytics;
var Submitter = require('../src/index').Submitter;
var ram = require('ramda');
var moment = require('moment');
var sa = new SensorsAnalytics;
var url = 'http://{$service_name}.cloud.sensorsdata.cn:8006/sa?project={$project_name}&token={$project_token}';
var url = 'http://test-ztx-jsl-fjj.cloud.sensorsdata.cn:8006/sa?token=6dd46a0ac9c03a85';
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
sa.track('12345', 'userHappyHappppppy');

// Track event with custom properties
sa.track('12345', 'newOrder', {
   orderId: '12345'
});

