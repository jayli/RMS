// vim: set sw=2 ts=2:

var vows = require('vows');
var assert = require('assert');
var syntaxChecker = require('../lib/jobs/syntaxChecker');

var suite = vows.describe('jobs/syntaxChecker');

suite.addBatch({
  'js-success': {
    topic: function() {
      var str = 'var yourname = 1;';
      var sc = new syntaxChecker({type: 'JavaScript'});
      var self = this;
      sc.run(str, function(content) {
        self.callback(str, content);
      });
    },
    'should success': function(str, content) {
      assert.equal(str, content);
    }
  },
  'js-failed': {
    topic: function() {
      var str = 'var yourname =;';
      var sc = new syntaxChecker({type: 'JavaScript'});
      var self = this;
      sc.run(str, function(content) {
        self.callback(str, content);
      });
    },
    'should success': function(str, content) {
      console.log(content);
      assert.notEqual(str, content);
    }
  }
});

suite.export(module, {error: false});
