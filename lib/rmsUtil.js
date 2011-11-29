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
  var asyncJob = require('./service/asyncJob');
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
  try {
    return gbk2utf8.convert(content);
  } catch (e) {
    return content;
  }
};

rmsUtil.GBKDecodeURI = function(content) {
  return content.replace(/%(\w\w)%(\w\w)/g, function(source, g1, g2) {
    return rmsUtil.gbk2utf8(new Buffer(g1 + g2, 'hex')).toString();
  });
};

rmsUtil.forceGC = nativeUtil.forceGC;

rmsUtil.__defineGetter__('now', function() {
  var date = new Date();
  return util.format(
    '%s-%s-%s %s:%s:%s',
    date.getFullYear(),
    rmsUtil.padding(date.getMonth() + 1, 0, 2),
    rmsUtil.padding(date.getDate(), 0, 2),
    rmsUtil.padding(date.getHours(), 0, 2),
    rmsUtil.padding(date.getMinutes(), 0, 2),
    rmsUtil.padding(date.getSeconds(), 0, 2)
  );
});

['log', 'warn', 'error'].forEach(function(i) {
  rmsUtil[i] = function() {
    arguments[0] = '[RMS ' + rmsUtil.now + '] ' + arguments[0];
    console[i].apply(global, arguments);
  };
});

rmsUtil.padding = function(str, padStr, length) {
  str = str.toString();
  while (str.length < length)
    str = padStr + str;
  return str;
};

rmsUtil.__defineGetter__('UUID', function() {
  return require('node-uuid')();
});
