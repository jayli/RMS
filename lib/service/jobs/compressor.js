// vim: set sw=2 ts=2:

/**
 * @fileoverview Compressor.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var rmsUtil = require('../../rmsUtil');
var uglify = require('uglify-js');
var cleanCSS = require('clean-css');

var compressor = module.exports = rmsUtil.createJob('compressor');

compressor.prototype.run = function(content, next) {
  try {
    if (this.config.type in compressors) {
      next(compressors[this.config.type](content));
      return;
    }
    // throw unsupport compressor
    next(null,
        new asyncJob.JOB_NOT_COMPLETE('Unsupported filetype compressor'));
  } catch (ex) {
    rmsUtil.error(ex.message);
    next(null, ex);
  }
};

var compressors = {
  JavaScript: function(code) {
    return uglify(code) + ';';
  },
  CSS: function(code) {
    return cleanCSS.process(code);
  }
};
