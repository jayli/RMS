// vim: set sw=2 ts=2:

/**
 * @fileoverview Resource Management System.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var express = require('express');
var cluster = require('cluster');
var _ = require('underscore');
var native2ascii = require('native2ascii').native2ascii;

var workerDispatcher = require('./workerDispatcher');
var rmsConfig = require('../rmsConfig');
var rmsUtil = require('../rmsUtil');
var store = require('./store');

var ServiceLog = require('../web/model/log').serviceLog;

require('../monitor/rmsMonitor').start(rmsConfig.monitor);

if (rmsConfig.producing) {
  cluster.on('death', function(worker) {
    rmsUtil.error('%s is dead.', worker.pid);
    fork();
  });

  if (cluster.isMaster) {
    var maxWorker = rmsConfig.maxWorker || 8;
    while (maxWorker--) fork();
  } else {
    startService();
  }
} else {
  startService();
}

function fork() {
  cluster.fork().on('message', function(o) {});
}

function send(res, data) {
  res.send(data);
  rmsConfig.producing && process.send(1);
}

function startService() {
  var app = express.createServer()
    .use(express.bodyParser())
    .set('jsonp callback', true);

  app.all('/precompile', function(req, res) {
    var params = req.body;
    var data = {
      result: params.content,
      success: false
    };

    try {
      var config = JSON.parse(params.config);
    } catch (e) {
      data.message = 'Parse config error. ' + e.message;
      return send(res, data);
    }

    config.async && send(res, {
      result: ''
    , rmsUtil: true
    , message: 'Async worker started.'
    });

    var functions = [];

    var serviceLog = new ServiceLog({
      oper_id: config.id
    });

    serviceLog.save({
      config: config
    }, function(err, results) {

      _(config.filelist).each(function(path, idx) {
        functions.push(function(callback) {
          var cfg = _(config).extend({
            id: idx
          , path: path.svnpath
          , type: rmsUtil.getFileType(path.svnpath)
          });
          delete cfg.filelist;

          var wd = new workerDispatcher(params.content, cfg);

          wd.on('message', function(data) {
            if (!data.success) return callback(new Error(data.message), null);
            if (this.config.type === 'JavaScript' || this.config.type === 'CSS')
              data.result = native2ascii(data.result || '');
            data.path = path;
            callback(null, data);
          });

          wd.dispatch();
        });
      });

      // 并行处理所有文件
      require('async').parallel(functions, function(err, data) {
        if (err && !rmsConfig.producing) throw err;
        var filelist = {};
        _(data).each(function(o) {
          filelist[o.path.filepath] = o.result;
        });
        store.writeFiles(config.appname, filelist, config.pubtype, function() {
          serviceLog.save({
            complete: true
          , status: 1
          }, function(err, results) {
            // 手动调用发布
          });
        });
      });

    });

  });

  app.get('/status/:id', function(req, res) {
    var id = req.params.id, obj = {};
    ServiceLog.getByOperId(id, function(err, status) {
      status.end = rmsUtil.formatDateTime(status.end);
      return send(res, status);
    });
  });

  app.listen(rmsConfig.api.port);
}
