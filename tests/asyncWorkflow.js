// vim: set sw=2 ts=2:

var aw = require('../lib/asyncWorkflow'),
    assert = require('assert');

var wf;

assert.throws(function() {
  wf = new aw('aa', {
    type: 'string',
    steps: [
      ['eascii', {}]
    ]
  });
}, aw.JOB_NOT_SUPPORTED);
