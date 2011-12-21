// vim: set sw=2 ts=2:

/**
 * @fileoverview write to store, nas, etc..
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var fs = require('fs');
var path = require('path');
var async = require('async');
var rmsConfig = require('../rmsConfig');
var rmsUtil = require('../rmsUtil');

var store = module.exports = {};

var writeFile = function(appname, filename, content, callback) {
  var name = path.join(rmsConfig.nasBase, appname, filename);
  if (!path.existsSync(name)) {
    var arr = name.split('/');
    arr.pop();
    rmsUtil.mkdir(arr.join('/'));
  }
  fs.writeFile(name, content, function(err) {
    rmsUtil.log('[%s] %s => %s.', appname, filename, name);
    callback(err);
  });
};

store.writeFiles = function(appname, obj, pubtype, callback) {
  var filelist = [];
  var functions = [];
  for (var i in obj) {
    functions.push(function(cb) {
      writeFile(appname, i, obj[i], function(err) {
        !err && filelist.push(i);
        cb(err, filelist);
      });
    });
  }
  async.parallel(functions, function(err, filelist) {
    if (err) return callback(err);
    store.writeLogs(appname, pubtype, filelist, function(err) {
      if (err) return callback(err);
      callback();
    });
  });
};

// 写入发布日志：
// $nas/publish/${appname}-${pubtype}-${timestamp}
// appname：应用名
// pubtype：1. 正式发布；4. 预发；5. Beta发布
// timestamp：时间戳，用于保证同步顺序
// 同时备份一份（发布部分在同步到pub100后会删除）：
// $nas/publish/backup/${appname}-${pubtype}-${timestamp}
store.writeLogs = function(appname, pubtype, filelist, callback) {
  var name = [appname, pubtype, +new Date].join('-');
  var pubname = path.join(rmsConfig.nasBase, 'publish', name);
  var bkname = path.join(rmsConfig.nasBase, 'publish', 'backup', name);
  filelist.unshift(appname);

  async.waterfall([
    function(next) {
      fs.writeFile(pubname, filelist.join('\n'), next);
    }
  , function() {
      fs.writeFile(bkname, filelist.join('\n'), callback);
    }
  ]);
};
