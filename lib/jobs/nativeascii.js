// vim: set sw=2 ts=2:

/**
 * @fileoverview NativeAscii.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var asyncJob = require('../asyncJob');
var util = require('util');

function nativeascii() {
  asyncJob.apply(this, arguments);
  this.name = 'nativeascii';
}
util.inherits(nativeascii, asyncJob);


nativeascii.prototype.run = function(next) {
  console.log('nativeascii');
  next();
};

module.exports = nativeascii;
