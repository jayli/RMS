// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS utilities.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var util = require('util');
var nativeUtil = require('nativeUtil');
var rmsUtil = module.exports;

rmsUtil.createException = function(message) {
  function exception(msg) {
    Error.apply(this, arguments);
    this.message = msg || message;
  }
  util.inherits(exception, Error);
  return exception;
};

rmsUtil.createJob = function(name) {
  var asyncJob = require('./asyncJob');
  function job() {
    asyncJob.apply(this, arguments);
    this.name = name;
  }
  util.inherits(job, asyncJob);
  return job;
};


rmsUtil.forceGC = nativeUtil.forceGC;
