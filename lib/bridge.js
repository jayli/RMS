// vim: set sw=2 ts=2:

/**
 * @fileoverview Worker-AsyncWorkflow-Bridge.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */

var path = require('path');
var util = require('util');

// this file is not running under current scope
var aw = require(path.join(__dirname, 'asyncWorkflow'));

onmessage = function(e) {
  var data = e.data;
  var wf = new aw(data.content, data.config);
  wf.on('start', function() {
    util.debug('Workflow start..');
  });
  wf.on('stepStart', function(e) {
    util.debug('Job start: ' + this.steps[this.current].name);
  });
  wf.on('stepComplete', function(e) {
    util.debug('Job Complete: ' + this.steps[this.current].name);
  });
  wf.on('error', function(e) {
    util.debug('Job Error: ' + e.exception.message);
  });
  wf.on('complete', function(e) {
    util.debug('Workflow complete..');
    postMessage({
      result: e.result,
      success: e.success
    });
  });
  wf.start();
};


onerror = function() {
  util.debug('Worker is unexpected terminated.');
};
