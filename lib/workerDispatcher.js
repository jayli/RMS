// vim: set sw=2 ts=2:

/**
 * @fileoverview Worker Dispatcher.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var fs = require('fs');
var util = require('util');
var emitter = require('events').EventEmitter;
var uuid = require('node-uuid');
var aw = require('./asyncWorkflow');

var rmsConfig = require('./rmsConfig');
var rmsUtil = require('./rmsUtil');
var gcTimer;

// worker dispatcher for managing workers.
function workerDispatcher(content, config) {
  var self = this;
  emitter.call(self);
  self.id = config.uuid || uuid();
  self.content = content;
  self.config = config;

  self.on('dispatch', function() {
    clearTimeout(gcTimer);
  });
}
util.inherits(workerDispatcher, emitter);

workerDispatcher.prototype.dispatch = function() {
  var self = this;

  self.emit('dispatch');
  var wf = new aw(self.content, self.config);

  var wfTime, stepTime;
  wf.on('start', function(evt) {
    wfTime = +new Date;
    rmsConfig.debug &&
        console.info('Workflow start [%s], filesize: %d K',
            data.uuid, data.content.length / 1000);
  });
  wf.on('stepStart', function(evt) {
    stepTime = +new Date;
    rmsConfig.debug &&
        console.info('Job start: %s.', this.steps[this.current].name);
  });
  wf.on('stepComplete', function(evt) {
    rmsConfig.debug &&
        console.info('Job complete, time: %s ms', +new Date - stepTime);
  });
  wf.on('error', function(evt) {
    console.error('Job error [%s]: %s', self.id, evt.error.message);
  });
  wf.on('complete', function(evt) {
    rmsConfig.debug &&
        console.info('Workflow complete [%s], time: %s ms',
            data.uuid, +new Date - wfTime);
    clearTimeout(self.timer);
    self.emit('message', {
      result: evt.result,
      message: evt.message,
      success: evt.success
    });
  });

  self.timer = setTimeout(function() {
    wf.rollback(new Error('Worker Timeout'));
  }, rmsConfig.workerTimeout || 10000);

  wf.start();
};

module.exports = workerDispatcher;
