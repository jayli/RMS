// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Utilities.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var rmsUtil = module.exports;
var util = require('util');
var nativeUtil = require('nativeUtil');
var iconv = require('iconv').Iconv;

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


var utf8 = new iconv('UTF-8', 'UTF-8');
rmsUtil.isUTF8 = function(content) {
  try {
    utf8.convert(content);
    return true;
  } catch (e) {
    return false;
  }
};


var gbk2utf8 = new iconv('GBK', 'UTF-8');
rmsUtil.gbk2utf8 = function(content) {
  return gbk2utf8.convert(content);
};


rmsUtil.forceGC = nativeUtil.forceGC;
