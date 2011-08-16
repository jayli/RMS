// vim: set sw=2 ts=2:

/**
 * @fileoverview Worker-AsyncWorkflow-Bridge.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var path = require('path');
var util = require('util');
var fs = require('fs');

// this file is not running under current scope
var aw = require(path.join(__dirname, 'asyncWorkflow'));

onmessage = function(e) {
  var data = e.data;
  var wf = new aw(data.content, data.config);
  var wfTime = 0, stepTime = 0, result = [0];
  wf.on('start', function(evt) {
    console.info('Workflow start. (at %s)', evt.time);
    wfTime = evt.time;
  });
  wf.on('stepStart', function(evt) {
    console.info('Job start: %s.', this.steps[this.current].name);
    stepTime = evt.time;
  });
  wf.on('stepComplete', function(evt) {
    console.info('Job Complete: %s. (%s ms)',
        this.steps[this.current].name, evt.time - stepTime);
    result.push(evt.time - stepTime);
    stepTime = 0;
  });
  wf.on('error', function(evt) {
    console.error('Job Error: ' + evt.exception.message);
  });
  wf.on('complete', function(evt) {
    console.info('Workflow complete. (%s ms)', evt.time - wfTime);
    result[0] = evt.time - wfTime;
    wfTime = 0;
    postMessage({
      result: evt.result,
      success: evt.success
    });
    var s = fs.createWriteStream('/tmp/compressor', {
      flags: 'a'
    });
    s.write(result.join('\t') + '\n');
    s.end();
  });
  wf.start();
};


onerror = function(e) {
  console.error('Worker is unexpected terminated.');
  console.error(util.inspect(e));
  postMessage({
    message: e.message,
    success: false
  });
};
