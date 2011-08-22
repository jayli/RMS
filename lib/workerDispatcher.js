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
var rmsConfig = require('./config');
var rmsUtil = require('./rmsUtil');
var maxWorker = rmsConfig.maxWorker;
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
        // console.log('nothing in queue');
        return;
      }

      var worker = getIdleWorker();

      if (worker) {
        var time = +new Date;
        // console.log('%s dispatching. workers left: %s',
        //    instance.id, workers.length);
        instance.worker = worker;
        instance.worker.onmessage = function(e) {
          instance.emit('message', e);

          workers.push(worker);
          clearTimeout(gcTimer);
          gcTimer = setTimeout(function() {
            rmsUtil.forceGC();
          }, rmsConfig.GCTimeout || 1000);
          // console.log(
          //     '%s is done. spent: %sms, worker left: %s',
          //     instance.id, +new Date - time, workers.length);

          // if there is somebody waiting, he can run now.
          wait();
        };
        instance.emit('dispatch');
        instance.worker.postMessage({
          content: instance.content,
          config: instance.config
        });
      } else {
        queue.push(instance);
        // console.log('push into queue, queue length: %s', queue.length);
      }
    };


module.exports = workerDispatcher;
