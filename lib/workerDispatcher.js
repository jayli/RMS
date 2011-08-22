// vim: set sw=2 ts=2:

/**
 * @fileoverview Worker Dispatcher.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var fs = require('fs');
var util = require('util');
var emitter = require('events').EventEmitter;
var uuid = require('node-uuid');
var webworker = require('webworker');
var rmsConfig = require('./rmsConfig');
var rmsUtil = require('./rmsUtil');
var maxWorker = rmsConfig.maxWorker || 10;
var workers = [];
var port = 5430;

var gcTimer = setTimeout(function() {}, 1000);

// start some worker
while (maxWorker--) {
  // fix current file absolute path
  var worker = new webworker(
      fs.realpathSync('lib/bridge.js'),
      rmsConfig.debug && {
        //args: '--debug=' + port++
      });
  workers.push(worker);
}


function getIdleWorker() {
  return workers.shift();
}


function workerDispatcher(content, config) {
  var self = this;

  emitter.call(self);
  self.id = uuid();
  self.content = content;
  self.config = config;

}
util.inherits(workerDispatcher, emitter);


workerDispatcher.prototype.dispatch = function() {
  this.on('dispatch', function() {
    clearTimeout(gcTimer);
  });
  wait(this);
};


var queue = [],
    waiting = false,
    wait = function(instance) {
      if (!instance) {
        instance = queue.shift();
      }

      // nothing in queue
      if (!instance) {
        return;
      }

      var worker = getIdleWorker();

      if (worker) {
        var time = +new Date;
        instance.worker = worker;
        instance.worker.onmessage = function(e) {
          instance.emit('message', e);

          workers.push(worker);
          gcTimer = setTimeout(function() {
            rmsUtil.forceGC();
          }, rmsConfig.GCTimeout || 1000);

          wait();
        };
        instance.emit('dispatch');
        instance.worker.postMessage({
          content: instance.content,
          config: instance.config
        });
      } else {
        queue.push(instance);
      }
    };


module.exports = workerDispatcher;
