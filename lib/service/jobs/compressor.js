// vim: set sw=2 ts=2:

/**
 * @fileoverview Compressor.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var rmsUtil = require('../../rmsUtil');

var compressor = module.exports = rmsUtil.createJob('compressor');

compressor.prototype.run = function(content, next) {
  try {
    var type = this.config.type;
    var tools = this.config.tools || defaultCompressors;

    if (!(type in compressors)) {
      return next(null, new asyncJob.JOB_NOT_COMPLETE(
        'Filetype Unsupported. ' + type));
    }

    if (type in tools) {
      return next(compressors[type][tools[type]](content));
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

var compressors = exports.compressors = {
  JavaScript: {
    uglifyjs: function(code, config) {
      return require('uglify-js')(code) + ';';
    }
  , jsmin: function(code, config) {
      return require('jsmin').jsmin(code);
    }
  }
, CSS: {
    'clean-css': function(code, config) {
      return require('clean-css').process(code);
    }
  }
};
