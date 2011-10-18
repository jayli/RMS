// vim: set sw=2 ts=2:

var vows = require('vows');
var assert = require('assert');
var aw = require('../lib/asyncWorkflow');

vows.describe('asyncWorkflow').addBatch({
  'async exception': {
    topic: function() {
      this.callback();
    },
    'throw exception': function() {
      assert.throws(function() {
        new aw('aa', {
          type: 'string',
          steps: [
            ['eascii', {}]
          ]
        });
      }, aw.JOB_NOT_SUPPORTED);
    }
  }
}).export(module, {error: false});
