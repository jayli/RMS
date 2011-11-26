// vim: set sw=2 ts=2:

var vows = require('vows');
var assert = require('assert');
var Worker = require('../lib/service/workerDispatcher');
var rmsConfig = require('../lib/rmsConfig');

var suite = vows.describe('dispatcher');

suite.addBatch({
  'empty steps': {
    topic: function() {
      var self = this;
      var w1 = new Worker('aa', {
        type: 'string',
        steps: []
      });
      w1.on('message', function(data) {
        self.callback(data);
      });
      w1.dispatch();
    },
    'should success': function(data) {
      assert.equal('aa', data.result);
      assert.ok(data.success);
    }
  },
  'timeout': {
    topic: function() {
      rmsConfig.workerTimeout = 10;
      var self = this;
      var w2 = new Worker('aa', {
        type: 'JavaScript',
        steps: [
          ['compressor', {}]
        ]
      });
      w2.on('message', function(data) {
        self.callback(data);
      });
      w2.dispatch();
    },
    'should timeout': function(data) {
      assert.equal('aa', data.result);
      assert.ok(!data.success);
    }
  }
});

suite.export(module, {error: false});
