// vim: set sw=2 ts=2:

/**
 * @fileoverview Worker-AsyncWorkflow-Bridge.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */

var path = require('path');
var sys = require('sys');

// this file is not running under current scope
var aw = require(path.join(__dirname, 'asyncWorkflow'));

onmessage = function(e) {
  var data = e.data;
  var wf = new aw(data.content, data.config);
  wf.on('start', function() {
    sys.debug('workflow is started..');
  });
  wf.on('stepStart', function(e) {
    sys.debug('Job start: ' + this.steps[this.current].name);
  });
  wf.on('stepComplete', function(e) {
    sys.debug('Job Complete: ' + this.steps[this.current].name);
  });
  wf.on('complete', function(e) {
    sys.debug('workflow is complete..');
    postMessage({
      result: e.result,
      success: e.success
    });
  });
  wf.start();
};
