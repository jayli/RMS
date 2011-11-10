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
};
