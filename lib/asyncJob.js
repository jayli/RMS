// vim: set sw=2 ts=2:

/**
 * @fileoverview Async Job.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var util = require('util');
var _ = require('underscore');

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

// internal functions {{{
function JOB_NOT_COMPLETE() {
  Error.apply(this, arguments);
  this.message = 'Uncaught exception. Job is not complete.';
}
util.inherits(JOB_NOT_COMPLETE, Error);
// }}}
