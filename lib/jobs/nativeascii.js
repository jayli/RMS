// vim: set sw=2 ts=2:

/**
 * @fileoverview NativeAscii.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var rmsUtil = require('../rmsUtil');
var native2ascii = require('native2ascii').native2ascii;

var nativeascii = module.exports = rmsUtil.createJob('nativeascii');

nativeascii.prototype.run = function(content, next) {
  try {
    next(native2ascii(content));
  } catch (e) {
    next(null, e);
  }
};
