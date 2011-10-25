// vim: set sw=2 ts=2:

/**
 * @fileoverview LESS job.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var rmsUtil = require('../rmsUtil');
var less = require('less');

var lessJob = module.exports = rmsUtil.createJob('less');

lessJob.prototype.run = function(content, next) {
  less.render(content, function(e, css) {
    if (e) {
      next(null, e);
    } else {
      next(css);
    }
  });
};
