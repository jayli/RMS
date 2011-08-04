// vim: set sw=2 ts=2:

/**
 * @fileoverview Async Workflow.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var util = require('util'),
    rmsConfig = require('./config'),
    _ = require('underscore');

function asyncWorkflow(content, config) {
  var self = this;

  self.config = _.extend({
    type: 'string',
    steps: []
  }, config);

  self.content = content || '';
  self.type = self.config.type;

  self.steps = [];
  self.current = -1;

  self.config.steps.forEach(function(step) {
    var jobName = step[0];
    var jobConfig = step[1];

    if (jobName in rmsConfig.jobs) {
      var Job = require('./jobs/' + jobName);
      var job = new Job(_.extend(rmsConfig.jobs[jobName], jobConfig));
      self.steps.push(job);
    }
  });

  // console.info(util.inspect(self));
}


asyncWorkflow.prototype.start = function() {
  this.current = -1;
  this.next();
};


asyncWorkflow.prototype.next = function() {
  var self = this;
  if (!self.steps[self.current + 1]) return;

  self.current += 1;
  self.steps[self.current].run(function() {
    self.next();
  });
};


asyncWorkflow.prototype.addJob = function(name, config) {
  var job = new require('./jobs/' + name)(config);
  self.steps.push(job);
};


asyncWorkflow.__defineGetter__('JOB_NOT_SUPPORTED', function() {
  return JOB_NOT_SUPPORTED;
});


module.exports = asyncWorkflow;

// internal functions {{{
function JOB_NOT_SUPPORTED() {
  Error.apply(this, arguments);
}
util.inherits(JOB_NOT_SUPPORTED, Error);
// }}}
