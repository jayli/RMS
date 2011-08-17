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

onmessage = function(e) {
  var data = e.data;
  var wf = new aw(data.content, data.config);

  var memoryUsageTimer, usage, results = [];
  memoryUsageTimer = setInterval(function() {
    memoryUsage(results);
  }, 1000);

  var wfTime, stepTime;
  wf.on('start', function(evt) {
    profiler.startProfiling('Workflow');
    wfTime = +new Date;
    //console.info('Workflow start.');
  });
  wf.on('stepStart', function(evt) {
    profiler.startProfiling(this.steps[this.current].name);
    stepTime = +new Date;
    //console.info('Job start: %s.', this.steps[this.current].name);
  });
  wf.on('stepComplete', function(evt) {
    profiler.stopProfiling(this.steps[this.current].name);
    console.log('stepTime: %s ms', +new Date - stepTime);
    //console.info('Job Complete: %s.', this.steps[this.current].name);
  });
  wf.on('error', function(evt) {
    console.error('Job Error: ' + evt.exception.message);
  });
  wf.on('complete', function(evt) {
    profiler.stopProfiling('Workflow');
    console.log('wfTime: %s ms', +new Date - wfTime);
    //console.info('Workflow complete.');
    postMessage({
      result: evt.result,
      success: evt.success
    });
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


function memoryUsage(results) {
  var usage = process.memoryUsage();
  results.push([
    usage['rss'] / 1000000,
    usage['vsize'] / 1000000,
    usage['heapTotal'] / 1000000,
    usage['heapUsed'] / 1000000
  ]);
  console.log('memory: %s', results[results.length - 1].join('\t'));
}
