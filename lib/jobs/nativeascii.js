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


nativeascii.prototype.run = function(content, next) {
  next(native2ascii(content));
};

module.exports = nativeascii;


function native2ascii(str) {
  var m, n = str, regexp = /[^\x00-\xff]/g;
  while (m = regexp.exec(n)) {
    str = str.split(m[0]).join(escape(m[0]).split('%').join('\\'));
  }
  return str;
}
