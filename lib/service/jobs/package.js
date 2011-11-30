// vim: set sw=2 ts=2:

/**
 * @fileoverview build a package.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var rmsUtil = require('../../rmsUtil');

var package = module.exports = rmsUtil.createJob('package');

package.prototype.run = function(content, next) {
  try {
    next(content);
  } catch (e) {
    next(null, e);
  }
};
