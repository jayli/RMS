// vim: set sw=2 ts=2:

/**
 * @fileoverview NativeAscii.
 * @author yyfrankyy@gmail.com (Frank Xu)
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

// internal function {{{
function native2ascii(str) {
  var character = str.split('');
  var ascii = '';
  for (var i = 0; i < character.length; i++) {
    var code = Number(character[i].charCodeAt(0));
    if (code > 127) {
      var charAscii = code.toString(16);
      charAscii = new String('0000').substring(charAscii.length, 4) + charAscii;
      ascii += '\\u' + charAscii;
    }else {
      ascii += character[i];
    }
  }
  return ascii;
}


function ascii2native(str) {
  var character = str.split('\\u');
  var nativeChar = character[0];
  for (var i = 0; i < character.length; i++) {
    var code = character[i];
    nativeChar += String.fromCharCode(parseInt('0x' + code.substring(0, 4)));
    if (code.length > 4) {
      nativeChar += code.substring(4, code.length);
    }
  }
  return nativeChar;
}
// }}}
