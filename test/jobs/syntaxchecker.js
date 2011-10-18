// vim: set sw=2 ts=2:

var assert = require('assert');
var syntaxChecker = require('../../lib/jobs/syntaxChecker');
exports.suite = {
  'js-syntaxchecker-success': {
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
  'js-syntaxchecker-failed': {
    topic: function() {
      var str = 'var yourname =;';
      var sc = new syntaxChecker({type: 'JavaScript'});
      var self = this;
      sc.run(str, function(content) {
        self.callback(str, content);
      });
    },
    'should success': function(str, content) {
      assert.notEqual(str, content);
    }
  }
}
