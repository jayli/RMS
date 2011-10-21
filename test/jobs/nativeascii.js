// vim: set sw=2 ts=2:

var nativeascii = require('../../lib/jobs/nativeascii');
var assert = require('assert');
exports.suite = {
  'nativeascii chinese': {
    topic: function() {
      var str = '中文';
      var na = new nativeascii({});
      na.run(str, this.callback);
    },
    'should success': function(content) {
      assert.equal('\\u4e2d\\u6587', content.toLowerCase());
    }
  },
  'nativeascii english': {
    topic: function() {
      var str = '\\u4e2d\\u6587';
      var na = new nativeascii({});
      na.run(str, this.callback);
    },
    'should success': function(content) {
      assert.equal('\\u4e2d\\u6587', content.toLowerCase());
    }
  },
  'nativeascii from gbk': {
    topic: function() {
      var fs = require('fs');
      var str = fs.readFileSync(
          fs.realpathSync('./test/data/chinese.js')).toString();
      var na = new nativeascii({});
      na.run(str, this.callback);
    },
    'should success': function(content) {
      assert.equal('\\u4e2d\\u6587', content.toLowerCase());
    }
  }
};
