// vim: set sw=2 ts=2:

/**
 * @fileoverview Config of RMS.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var fs = require('fs');
var path = require('path');

// read version infomation from package.json
var package = JSON.parse(fs.readFileSync(
            path.join(__dirname, '..', 'package.json')));

var config = module.exports = {

  title: 'Resource Management System',
  name: 'Async Workflow',

  // Enabled jobs w/ default configs.
  jobs: {
    nativeascii: {},
    compressor: {},
    syntaxChecker: {}
  },

  // for your output usage
  api: {
    endpoint: 'http://127.0.0.1:8080',
    port: 8080,
    version: package.version
  },

  // log debug message
  debug: true,

  // base on how many cpus you have
  maxWorker: 2,

  // timeout for force GC, don't set it too small,
  // GC of v8 cost not just a little resource.
  GCTimeout: 2000,

  // timeout for worker
  workerTimeout: 10000

};
