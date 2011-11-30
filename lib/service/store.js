// vim: set sw=2 ts=2:

/**
 * @fileoverview write to store, nas, etc..
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var fs = require('fs');
var path = require('path');
var rmsConfig = require('../rmsConfig');
var rmsUtil = require('../rmsUtil');

var store = module.exports = {};

store.writeFile = function(appname, filename, content) {
  var name = path.join(rmsConfig.nasBase, appname, filename);
  if (!path.existsSync(name)) {
    var arr = name.split('/');
    arr.pop();
    rmsUtil.mkdir(arr.join('/'));
  }
  fs.writeFileSync(name, content);
};

store.writeFiles = function(appname, pubtype, obj) {
  var filelist = [];
  for (var i in obj) {
    store.writeFile(appname, i, obj[i]);
    filelist.push(i);
  }
  store.writeLogs(appname, pubtype, filelist);
};

// 写入发布日志：
// $nas/publish/${appname}-${pubtype}-${timestamp}
// appname：应用名
// pubtype：1. 正式发布；4. 预发；5. Beta发布
// timestamp：时间戳，用于保证同步顺序
// 同时备份一份（发布部分在同步到pub100后会删除）：
// $nas/publish/backup/${appname}-${pubtype}-${timestamp}
store.writeLogs = function(appname, pubtype, filelist) {
  var name = [appname, pubtype, +new Date].join('-');
  var pubname = path.join(rmsConfig.nasBase, 'publish', name);
  var bkname = path.join(rmsConfig.nasBase, 'publish', 'backup', name);
  filelist.unshift(appname);
  fs.writeFileSync(pubname, filelist.join('\n'));
  fs.writeFileSync(bkname, filelist.join('\n'));
};

store.writeFile('tms', '/tmp/file/path', new Buffer('中文'));
