// vim: set sw=2 ts=2:

/**
 * @fileoverview Async Job.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var util = require('util');
var _ = require('underscore');
var rmsUtil = require('./rmsUtil');

function asyncJob(config) {
  this.name = '';
  this.config = _.extend({}, config);
}


asyncJob.prototype.run = function(next) {
  console.error('Impl your asyncJob "run()" function.');
  next();
};


asyncJob.__defineGetter__('JOB_NOT_COMPLETE', function() {
  return JOB_NOT_COMPLETE;
});


module.exports = asyncJob;

var JOB_NOT_COMPLETE = rmsUtil.createException(
    'Uncaught exception. Job is not complete.');
