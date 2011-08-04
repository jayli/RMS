// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS utilities.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var util = require('util');
var rmsUtil = module.exports;

rmsUtil.createException = function(message) {
    function exception() {
      Error.apply(this, arguments);
      this.message = message;
    }
    util.inherits(exception, Error);
    return exception;
};
