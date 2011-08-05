// vim: set sw=2 ts=2:

var util = require('util');
var assert = require('assert');
var Worker = require('../lib/workerDispatcher');

var worker = new Worker('aa', {
  type: 'string',
  steps: [
    ['nativeascii', {}]
  ]
});

worker.on('message', function(e) {
  assert.equal('aa', e.data.result);
  assert.ok(e.data.success);
});

worker.dispatch();
