// vim: set sw=2 ts=2:

var dispatcher = require('../lib/workerDispatcher');

var w = new dispatcher('aa', {
  type: 'string',
  steps: [
    ['nativeascii', {}]
  ]
});
