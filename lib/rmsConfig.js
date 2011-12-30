// vim: set sw=2 ts=2:

/**
 * @fileoverview Config of RMS.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var fs = require('fs');
var path = require('path');

var package = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'package.json')));

var config = module.exports = {
  title: 'Resource Management System',
  name: 'Async Workflow'
};

config.version = package.version;

config.producing = process.env.NODE_ENV === 'production';

// Enabled jobs w/ default configs.
config.jobs = {
  nativeascii: {},
  compressor: {
    yuicompressor: 'http://localhost:8080/yuiCompress.htm'
  , closurecompiler: 'http://localhost:8080/closureCompile.htm'
  },
  less: {},
  coffeescript: {}
};

// for your output usage
config.api = {
  port: 9909,
  host: '127.0.0.1',
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
  username: 'assetsadmin',
  password: 'scm1234'
};

config.logBase = exports.producing ?
  '/home/admin/logs/service/' : '/tmp/service/'

config.nasBase = exports.producing ?
  '/home/admin/nas/tms/' : '/tmp/nas/'

// limit for filesize, default: 10M
config.filesizeLimit = 1048576;

// base on how many cpus you have
config.maxWorker = require('os').cpus().length;

// timeout for force GC, don't set it too small,
// GC of v8 cost not just a little resource. default: 2s(when idle)
config.GCTimeout = 2000;

// timeout for worker, default: 10s
config.workerTimeout = 10000;

// for webworker debug
process.env.NODE_DEBUG = config.debugWorker ? 0x8 : 0;

config.exts = {
  CSS: ['.css', '.less', '.sass']
, JavaScript: ['.js', '.coffee']
, Image: ['.jpg', 'jpeg', '.png', 'gif']
, Flash: ['.swf']
};

config.binary = ['Image', 'Flash'];

// 文本类型的后缀
config.txtExts = [
  'txt',
  'php', 'java', 'cs', 'py', 'rb', 'css', 'js', 'sh', 'bat',
  'xml', 'html', 'properties', 'md', 'markdown'
];

config.imgExts = [
  'jpg', 'jpeg', 'png', 'gif', 'bmp'
];

config.rmsClientExts = {
  '.css': 'CSS',
  '.js': 'JavaScript'
};

config.__defineGetter__('hostname', function() {
  return require('os').hostname();
});
