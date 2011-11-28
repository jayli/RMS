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

var rmsConfig = require('../rmsConfig');
var rmsUtil = require('../rmsUtil');

// worker dispatcher for managing workers.
function workerDispatcher(content, config) {
  var self = this;
  emitter.call(self);
  self.id = config.uuid || uuid();
  self.content = content;
  self.config = config;
}
util.inherits(workerDispatcher, emitter);

workerDispatcher.prototype.dispatch = function() {
  var self = this;

  self.emit('dispatch');
  var wf = new aw(self.content, self.config);

  var wfTime, stepTime;
  wf.on('start', function(evt) {
    wfTime = +new Date;
    console.info('[%s] Workflow start, filesize: %d K',
      self.id, self.content.length / 1000);
  });
  wf.on('stepStart', function(evt) {
    stepTime = +new Date;
    console.info('[%s] Job start, %s.',
      self.id, this.steps[this.current].name);
  });
  wf.on('stepComplete', function(evt) {
    console.info('[%s] Job complete, %s, time: %s ms',
      self.id, this.steps[this.current].name, +new Date - stepTime);
  });
  wf.on('error', function(evt) {
    console.error('[%s] Job error, %s, %s',
      self.id, this.steps[this.current].name, evt.error.message);
  });
  wf.on('complete', function(evt) {
    console.info('[%s] Workflow complete, time: %s ms',
      self.id, +new Date - wfTime);
    clearTimeout(self.timer);
    self.emit('message', {
      result: evt.result,
      message: evt.message,
      success: evt.success
    });
  });

  if (!self.config.async) {
    self.timer = setTimeout(function() {
      wf.rollback(new Error('Worker timeout.'));
    }, rmsConfig.workerTimeout || 10000);
  } else {
    self.emit('message', {
      message: 'Worker started.'
    });
  }

  wf.start();
};

module.exports = workerDispatcher;
