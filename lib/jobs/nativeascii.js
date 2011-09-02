// vim: set sw=2 ts=2:

/**
 * @fileoverview NativeAscii.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var asyncJob = require('../asyncJob');
var util = require('util');
var native2ascii = require('native2ascii').native2ascii;

function nativeascii() {
  asyncJob.apply(this, arguments);
  this.name = 'nativeascii';
}
util.inherits(nativeascii, asyncJob);


nativeascii.prototype.run = function(content, next) {
  try {
    next(native2ascii(content));
  } catch (e) {
    next(null, e);
  }
};

module.exports = nativeascii;
