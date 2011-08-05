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

wf = new aw('中文', {
  type: 'string',
  steps: [
    ['nativeascii', {}]
  ]
});
wf.on('stepStart', function(e) {
  assert.equal(e.input, '中文');
});
wf.on('stepComplete', function(e) {
  assert.equal(e.output, '\\u4E2D\\u6587');
});
wf.start();
