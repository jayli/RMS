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

var gcTimer;
var workers = [];
var queue = [];
var port = 5430;
var bridge = fs.realpathSync('lib/bridge.js');


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
  this.on('dispatch', function() {
    clearTimeout(gcTimer);
  });
  wait(this);
};


// prepare workers
function startWorkers() {
  var maxWorker = rmsConfig.maxWorker || 10;
  // clear all running workers
  rmsConfig.debug &&
    console.log('Clear All Idle workers(%s)..', workers.length);
  workers.forEach(function(worker, idx) {
    workers[idx].onmessage = null;
    workers[idx].terminate();
    workers[idx] = null;
  });
  workers = [];
  while (maxWorker--) {
    createWorker();
  }
}

startWorkers();


// watch file change then restart child worker.
// TODO watch more files
fs.watchFile(bridge, function(cur, prev) {
  if (cur.mtime.getTime() != prev.mtime.getTime()) {
    // console.log('Bridge file changed, restart all workers..');
    startWorkers();
  }
});


// if worker is not null and not dead, just put it back;
// if worker is not null and dead(timeout), terminate it and create a new one;
// if worker is not specific, just create a new one.
function createWorker(worker, dead) {
  if (worker && dead) {
    worker.onmessage = null;
    worker.terminate();
    worker = null;
  }
  if (!worker || dead) {
    // fix absolute path of current file
    try {
      worker = new webworker(bridge);
      worker.onexit = function(code, signal) {
        var idx = workers.indexOf(worker);
        //console.warn('Worker exited, %s, position: %s, restart at %s.',
        //    code, idx, new Date);
        if (idx != -1) {
          workers[idx] = new webworker(bridge);
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


// get idle workers from queue,
// if there is no idle worker left, return undefined.
function getIdleWorker() {
  return workers.shift();
}


// put instance in waiting queue til there is idle worker left.
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

    // set a timeout for single worker
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


// if worker was dead, return original content with error message,
// if not, return compiled content with success message,
// than put worker back to waiting list.
function dispose(instance, o, dead) {
  dead && rmsConfig.debug && console.error(o.message);

  // kill worker immediately
  // create a new Worker, and put it in workers
  createWorker(instance.worker, dead);

  instance.emit('message', o);

  // force GC
  tryForceGC();

  // see if there is waiting job in queue
  wait();

}

function tryForceGC() {
  gcTimer = setTimeout(function() {
    rmsUtil.forceGC();
  }, rmsConfig.GCTimeout || 1000);
}

module.exports = workerDispatcher;
