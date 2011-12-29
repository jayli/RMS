// vim: set sw=2 ts=2:

/**
 * @fileoverview Compressor.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var rmsUtil = require('../../rmsUtil');
var asyncJob = require('../asyncJob');
var _ = require('underscore');
var rest = require('restler');

var compressor = module.exports = rmsUtil.createJob('compressor');

compressor.prototype.run = function(content, next) {
  try {
    var type = this.config.type;
    var tools = _(this.config.tools).defaults(defaultCompressors);

    if (!(type in compressors)) {
      // 不支持的直接pass
      rmsUtil.error(new asyncJob.JOB_NOT_COMPLETE(
        'Filetype Unsupported. ' + type));
      return next(content);
    }

    if (type in tools) {
      return compressors[type][tools[type]](content, this.config, next);
    } else {
      return next(null, new asyncJob.JOB_NOT_COMPLETE(
        'Compressor Unsupported. ' + type + ': ' + tools[type]));
    }
  } catch (ex) {
    rmsUtil.error(ex.message);
    next(null, ex);
  }
};

var defaultCompressors = exports.defaults = {
  JavaScript: 'uglifyjs'
, CSS: 'clean-css'
};

var thirdparty = function(api, code, config, callback) {
  rest.post(api, {data: {
    code: code
  , type: rmsUtil.UUID + (config.type === 'JavaScript' ? '.js' : '.css')
  }})
  .on('error', callback)
  .on('complete', function(data, res) {
    if (res.statusCode === 200) return callback(data);
    callback(null, new Error('HTTP Error: ' + res.statusCode));
  });
};

var compressors = exports.compressors = {
  JavaScript: {
    uglifyjs: function(code, config, callback) {
      try {
        callback(require('uglify-js')(code) + ';');
      } catch (e) {callback(null, e)}
    }
  , jsmin: function(code, config, callback) {
      try {
        callback(require('jsmin').jsmin(code));
      } catch (e) {callback(null, e)}
    }
  , yuicompressor: function(code, config, callback) {
      thirdparty(config.yuicompressor, code, config, callback);
    }
  , closurecompiler: function(code, config, callback) {
      thirdparty(config.closurecompiler, code, config, callback);
    }
  }
, CSS: {
    'clean-css': function(code, config, callback) {
      try {
        callback(require('clean-css').process(code));
      } catch (e) {callback(null, e)}
    }
  , yuicompressor: function(code, config, callback) {
      thirdparty(config.yuicompressor, code, config, callback);
    }
  }
};
