// vim: set sw=2 ts=2:

/**
 * @fileoverview write to nas.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var rmsUtil = require('../../rmsUtil');

var nas = module.exports = rmsUtil.createJob('nas');

nas.prototype.run = function(content, next) {
  try {
    rmsUtil.log(this.config);
    next(content);
  } catch (e) {
    next(null, e);
  }
};
