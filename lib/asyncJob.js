// vim: set sw=2 ts=2:

/**
 * @fileoverview Async Job.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var _ = require('underscore');

function asyncJob(config) {
  this.name = '';
  this.config = _.extend({}, config);
}


asyncJob.prototype.run = function(next) {
  console.error('Impl your asyncJob "run()" function.');
  next();
};


module.exports = asyncJob;
