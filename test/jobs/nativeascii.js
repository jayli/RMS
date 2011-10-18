// vim: set sw=2 ts=2:

var nativeascii = require('../../lib/jobs/nativeascii');
var assert = require('assert');
exports.suite = {
  'js-nativeascii-success': {
    topic: function() {
      var str = '中文';
      var na = new nativeascii({});
      na.run(str, this.callback);
    },
    'should success': function(content) {
      assert.equal('\\u4e2d\\u6587', content.toLowerCase());
    }
  }
}
