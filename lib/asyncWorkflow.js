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
  self.__content = self.content;
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
    } else {
      throw new asyncWorkflow.JOB_NOT_SUPPORTED;
    }
  });
}


// Start this workflow
asyncWorkflow.prototype.start = function() {
  console.info('AsyncWorkflow Start..');
  this.current = -1;
  this.next(this.content);
};


// Next step
asyncWorkflow.prototype.next = function(content) {
  var self = this;
  if (!self.steps[self.current + 1]) {
    console.info('DONE.');
    return;
  }

  self.current += 1;

  console.info(' [%s] %s', self.current, self.steps[self.current].name);
  console.info('   [INPUT]: %s', content);

  self.steps[self.current].run(self.content, function(nextContent) {
    if (!nextContent) {
      throw new asyncWorkflow.ASYNC_WORKFLOW_NOT_COMPLETE;
    }

    console.info('   [OUTPUT]: %s', nextContent);
    self.content = nextContent;
    self.next(self.content);
  });
};


// Add a job when workflow has been started.
asyncWorkflow.prototype.addJob = function(name, config) {
  var job = new require('./jobs/' + name)(config);
  self.steps.push(job);
};


asyncWorkflow.__defineGetter__('ASYNC_WORKFLOW_NOT_COMPLETE', function() {
  return ASYNC_WORKFLOW_NOT_COMPLETE;
});


asyncWorkflow.__defineGetter__('JOB_NOT_SUPPORTED', function() {
  return JOB_NOT_SUPPORTED;
});


module.exports = asyncWorkflow;

// internal functions {{{
function JOB_NOT_SUPPORTED() {
  Error.apply(this, arguments);
  this.message = 'Job not supported.';
}
util.inherits(JOB_NOT_SUPPORTED, Error);

function ASYNC_WORKFLOW_NOT_COMPLETE() {
  Error.apply(this, arguments);
  this.message = 'Async Workflow not complete';
}
util.inherits(ASYNC_WORKFLOW_NOT_COMPLETE, Error);
// }}}
