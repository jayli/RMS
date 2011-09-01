// vim: set sw=2 ts=2:

/**
 * @fileoverview Worker-AsyncWorkflow-Bridge.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var path = require('path');
var util = require('util');
var fs = require('fs');
var profiler = require('v8-profiler');

// this file is not running under current scope
var aw = require(path.join(__dirname, 'asyncWorkflow'));
var rmsConfig = require(path.join(__dirname, 'rmsConfig'));

var result = '';
var perf = rmsConfig.debug && rmsConfig.perf;

onmessage = function(e) {
  result = e.data.content;

  var data = e.data;
  var wf = new aw(data.content, data.config);

  var wfTime, stepTime;
  wf.on('start', function(evt) {
    perf && profiler.startProfiling('Workflow');
    wfTime = +new Date;
    rmsConfig.debug &&
        console.info('Workflow start.');
  });
  wf.on('stepStart', function(evt) {
    perf && profiler.startProfiling(this.steps[this.current].name);
    stepTime = +new Date;
    rmsConfig.debug &&
        console.info('Job start: %s.', this.steps[this.current].name);
  });
  wf.on('stepComplete', function(evt) {
    perf && profiler.stopProfiling(this.steps[this.current].name);
    rmsConfig.debug &&
        console.log('Job Complete, time: %s ms', +new Date - stepTime);
  });
  wf.on('error', function(evt) {
    console.error('Job Error: ' + evt.error.message);
  });
  wf.on('complete', function(evt) {
    perf && profiler.stopProfiling('Workflow');
    console.log('Workflow Complete, time: %s ms', +new Date - wfTime);
    postMessage({
      result: evt.result,
      message: evt.message,
      success: evt.success
    });
    result = '';
  });
  wf.start();
};


onerror = function(e) {
  console.error('Worker Error: %s', e.message);
  postMessage({
    result: result,
    message: e.message,
    success: false
  });
};


onclose = function() {
  console.warn('Worker is closed.');
};
