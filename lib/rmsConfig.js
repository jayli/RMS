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
  name: 'Async Workflow'
};

config.version = package.version;

// Enabled jobs w/ default configs.
config.jobs = {
  nativeascii: {},
  compressor: {},
  less: {},
  coffeescript: {},
  syntaxChecker: {}
};

// for your output usage
config.api = {
  endpoint: 'http://127.0.0.1:8088',
  port: 8088,
  version: config.version
};

// open debug mode
config.debug = false;

// open worker debug
config.debugWorker = false;

// open perf debug
config.monitor = {
  port: 8089,
  interval: 5000,
  realtime: false
};

// subversion config
config.svn = {
  host: 'svn.taobao-develop.com',
  username: 'wenhe',
  password: 'Yukikaze'
};

// limit for filesize, default: 10M
config.filesizeLimit = 1048576;

// base on how many cpus you have
config.maxWorker = config.debug ? 2 : 8;

// timeout for force GC, don't set it too small,
// GC of v8 cost not just a little resource. default: 2s(when idle)
config.GCTimeout = 2000;

// timeout for worker, default: 10s
config.workerTimeout = 10000;

// for webworker debug
process.env.NODE_DEBUG = config.debugWorker ? 0x8 : 0;
