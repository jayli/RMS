// vim: set sw=2 ts=2:

/**
 * @fileoverview Worker Dispatcher.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var fs = require('fs');
var util = require('util');
var emitter = require('events').EventEmitter;
var aw = require('./asyncWorkflow');

var rmsConfig = require('../rmsConfig');
var rmsUtil = require('../rmsUtil');

// worker dispatcher for managing workers.
function workerDispatcher(content, config) {
  var self = this;
  emitter.call(self);
  self.id = config.id || rmsUtil.UUID;
  self.content = content;
  self.config = config;
}
util.inherits(workerDispatcher, emitter);

workerDispatcher.prototype.dispatch = function() {
  var self = this;

  self.emit('dispatch');

  if (!self.config.path) {
    return workflow().start();
  }

  rmsUtil.log('[%s] fetch from svn: %s', self.id, self.config.path);
  require('./svn/query')(
    self.config.path, rmsConfig.svn,
    function(err, content) {
      self.content = content;
      workflow().start();
    });

  function workflow() {
    var wfTime, stepTime;
    var wf = new aw(self.content, self.config)
      .on('start', function(evt) {
        wfTime = +new Date;
        rmsUtil.log('[%s] Workflow start, filesize: %d K',
          self.id, self.content.length / 1000);
      })
      .on('stepStart', function(evt) {
        stepTime = +new Date;
        rmsUtil.log('[%s] Job start, %s.',
          self.id, this.steps[this.current].name);
      })
      .on('stepComplete', function(evt) {
        rmsUtil.log('[%s] Job complete, %s, time: %s ms',
          self.id, this.steps[this.current].name, +new Date - stepTime);
      })
      .on('error', function(evt) {
        rmsUtil.error('[%s] Job error, %s, %s',
          self.id, this.steps[this.current].name, evt.error.message);
      })
      .on('complete', function(evt) {
        rmsUtil.log('[%s] Workflow complete, time: %s ms',
          self.id, +new Date - wfTime);
        clearTimeout(self.timer);
        !self.config.async && self.emit('message', {
          result: evt.result,
          message: evt.message,
          success: evt.success
        });
      });

    if (self.config.async) {
      self.emit('message', {
        result: '',
        success: true,
        message: 'Async worker started.',
        asyncId: self.id
      });
    } else {
      self.timer = setTimeout(function() {
        wf.rollback(new Error('Worker timeout.'));
      }, rmsConfig.workerTimeout || 10000);
    }
    return wf;
  }
};

module.exports = workerDispatcher;
