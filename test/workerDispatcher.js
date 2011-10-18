// vim: set sw=2 ts=2:

var util = require('util');
var assert = require('assert');
var Worker = require('../lib/workerDispatcher');
var rmsConfig = require('../lib/rmsConfig');

var w1 = new Worker('aa', {
  type: 'string',
  steps: [
    ['nativeascii', {}]
  ]
});
w1.on('message', function(data) {
  assert.equal('aa', data.result);
  assert.ok(data.success);
  w1.worker.terminate();
});
w1.dispatch();

// timeout
rmsConfig.workerTimeout = 10;
var w2 = new Worker('aa', {
  type: 'string',
  steps: [
    ['nativeascii', {}]
  ]
});
w2.on('message', function(data) {
  assert.equal('aa', data.result);
  assert.ok(!data.success);
  w2.worker.terminate();
});
w2.dispatch();
