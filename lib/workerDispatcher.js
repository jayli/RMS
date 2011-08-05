// vim: set sw=2 ts=2:

/**
 * @fileoverview Worker Dispatcher.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */

var fs = require('fs');
var util = require('util');
var emitter = require('events').EventEmitter;
var worker = require('webworker');

function workerDispatcher(content, config) {
  emitter.call(this);

  var self = this;

  this.content = content;
  this.config = config;

  // fix current file absolute path
  self.worker = new worker(fs.realpathSync('lib/bridge.js'));
  self.worker.onmessage = function(e) {
    self.emit('message', e);
    self.worker.terminate();
  };
}
util.inherits(workerDispatcher, emitter);


workerDispatcher.prototype.dispatch = function() {
  var self = this;
  self.worker.postMessage({
    content: self.content,
    config: self.config
  });
};

module.exports = workerDispatcher;
