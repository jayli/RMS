// vim: set sw=2 ts=2:

/**
 * @fileoverview coffeescript job.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var rmsUtil = require('../../rmsUtil');
var coffee = require('coffee-script');

var coffeescript = module.exports = rmsUtil.createJob('coffeescript');

coffeescript.prototype.run = function(content, next) {
  try {
    next(coffee.compile(content));
  } catch (e) {
    next(null, e);
  }
};
