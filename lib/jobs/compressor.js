// vim: set sw=2 ts=2:

/**
 * @fileoverview Compressor.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var asyncJob = require('../asyncJob');
var util = require('util');
var uglify = require('uglify-js');
var cleanCSS = require('clean-css');

function compressor() {
  asyncJob.apply(this, arguments);
  this.name = 'compressor';
}
util.inherits(compressor, asyncJob);


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
    console.error(ex.message);
    next(null, ex);
  }
};


var compressors = {
  JavaScript: uglify,
  CSS: cleanCSSMinfiy
};


function cleanCSSMinfiy(content) {
  return cleanCSS.process(content);
}

module.exports = compressor;
