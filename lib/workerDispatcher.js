// vim: set sw=2 ts=2:

/**
 * @fileoverview Worker Dispatcher.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var fs = require('fs');
var util = require('util');
var emitter = require('events').EventEmitter;
var uuid = require('node-uuid');
var webworker = require('webworker').Worker;
var rmsConfig = require('./rmsConfig');
var rmsUtil = require('./rmsUtil');


function workerDispatcher(content, config) {
  var self = this;
  emitter.call(self);
  self.id = config.uuid || uuid();
  self.content = content;
  self.config = config;
}
util.inherits(workerDispatcher, emitter);


var gcTimer;
workerDispatcher.prototype.dispatch = function() {
  this.on('dispatch', function() {
    clearTimeout(gcTimer);
  });
  wait(this);
};


var maxWorker = rmsConfig.maxWorker || 10;
var workers = [];
var queue = [];
var port = 5430;

console.log(new Date().toString());
while (maxWorker--) {
  createWorker();
}

function createWorker(worker, dead) {
  if (worker && dead) {
    worker.onmessage = null;
    worker.terminate();
    worker = null;
  }
  if (!worker || dead) {
    // fix current file absolute path
    try {
      worker = new webworker(fs.realpathSync('lib/bridge.js'));
      worker.onexit = function(code, signal) {
        var idx = workers.indexOf(worker);
        console.warn('Worker exited, %s, position: %s, restart at %s.',
            code, idx, new Date);
        if (idx != -1) {
          workers[idx] = new webworker(fs.realpathSync('lib/bridge.js'));
          workers[idx].onexit = arguments.callee;
          worker = workers[idx];
        }
      };
    } catch (e) {
      console.error('Can not start worker. %s', e.message);
    }
  }
  workers.push(worker);
}

function getIdleWorker() {
  return workers.shift();
}

function wait(instance) {
  if (!instance) {
    instance = queue.shift();
  }

  // nothing in queue
  if (!instance) {
    return;
  }

  var worker = getIdleWorker();

  if (worker) {

    // now dispatching
    instance.emit('dispatch');

    clearTimeout(instance.workerTimer);
    instance.worker = worker;
    instance.worker.onmessage = function(e) {
      clearTimeout(instance.workerTimer);
      dispose(instance, e.data);
    };

    // call child worker
    instance.worker.postMessage({
      content: instance.content,
      config: instance.config,
      uuid: instance.id
    });

    instance.workerTimer = setTimeout(function() {
      dispose(instance, {
        result: instance.content,
        message: 'Worker Timeout',
        success: false
      }, true);
    }, rmsConfig.workerTimeout || 10000);

  } else {
    queue.push(instance);
  }
}

function dispose(instance, o, dead) {
  dead && rmsConfig.debug && console.error(o.message);

  // kill worker immediately
  // create a new Worker, and put it in workers
  createWorker(instance.worker, dead);

  instance.emit('message', o);

  // instance = null;

  // force GC
  tryForceGC();

  // see if there is job in queue
  wait();

}

function tryForceGC() {
  gcTimer = setTimeout(function() {
    rmsUtil.forceGC();
  }, rmsConfig.GCTimeout || 1000);
}

module.exports = workerDispatcher;
