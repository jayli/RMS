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
    less: {},
    coffeescript: {},
    syntaxChecker: {}
  },

  // for your output usage
  api: {
    endpoint: 'http://127.0.0.1:8088',
    port: 8088,
    version: package.version
  },

  // open debug mode
  debug: true,

  // open worker debug
  debugWorker: false,

  perf: false,

  // limit for filesize, default: 10M
  filesizeLimit: 1048576,

  // base on how many cpus you have
  maxWorker: 2,

  // timeout for force GC, don't set it too small,
  // GC of v8 cost not just a little resource. default: 2s(when idle)
  GCTimeout: 2000,

  // timeout for worker, default: 10s
  workerTimeout: 10000

};

// for webworker debug
process.env.NODE_DEBUG = config.debugWorker ? 0x8 : 0;
