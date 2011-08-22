// vim: set sw=2 ts=2:

var assert = require('assert');
var nativeascii = require('../lib/jobs/nativeascii');

var str = '中文';
var na = new nativeascii({});
na.run(str, function(content) {
  assert.equal('\\u4e2d\\u6587', content.toLowerCase());
});
