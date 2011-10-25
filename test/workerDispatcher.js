// vim: set sw=2 ts=2:

var vows = require('vows');

var util = require('util');
var assert = require('assert');
var Worker = require('../lib/workerDispatcher');
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
        self.callback(w1, data);
      });
      w1.dispatch();
    },
    'should success': function(w1, data) {
      assert.equal('aa', data.result);
      assert.ok(data.success);
      w1.worker.terminate();
    }
  },
  'timeout': {
    topic: function() {
      rmsConfig.workerTimeout = 1;
      var self = this;
      var w2 = new Worker('aa', {
        type: 'string',
        steps: []
      });
      w2.on('message', function(data) {
        self.callback(w2, data);
      });
      w2.dispatch();
    },
    'should timeout': function(w2, data) {
      assert.equal('aa', data.result);
      assert.ok(!data.success);
      w2.worker.terminate();
    }
  }
});

suite.export(module, {error: false});
