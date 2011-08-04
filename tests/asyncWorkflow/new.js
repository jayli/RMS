// vim: set sw=2 ts=2:

var aw = require('../../lib/asyncWorkflow'),
    assert = require('assert');

assert.throws(function() {
  new aw('aa', {
    type: 'string',
    steps: [
      ['eascii', {}]
    ]
  });
}, aw.JOB_NOT_SUPPORTED);

var wf = new aw('中文', {
  type: 'string',
  steps: [
    ['nativeascii', {}]
  ]
});
wf.on('start', function() {
  console.info('AsyncWorkflow Start..');
});
wf.on('stepStart', function(e) {
  console.info(' [%s] %s', this.current, this.steps[this.current].name);
  console.info('   [INPUT]: %s', e.input);
});
wf.on('stepEnd', function(e) {
  console.info('   [OUTPUT]: %s', e.output);
});
wf.on('end', function(e) {
  console.info('DONE.');
});
wf.start();
