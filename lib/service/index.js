// vim: set sw=2 ts=2:

/**
 * @fileoverview Resource Management System.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var express = require('express');
var cluster = require('cluster');
var _ = require('underscore');

var workerDispatcher = require('./workerDispatcher');
var rmsConfig = require('../rmsConfig');
var rmsUtil = require('../rmsUtil');
var logger = require('./logger');
var store = require('./store');

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
  var native2ascii = require('native2ascii').native2ascii;
  var app = express.createServer().use(express.bodyParser());
  app.set('jsonp callback', true);
  app.all('/precompile', function(req, res) {
    var params = req.body;
    var data = {
      result: params.content,
      success: false
    };
    var limit = rmsConfig.filesizeLimit || 1048576;
    if (params.content.length > limit) {
      data.message = 'Filesize too large, limit: ' + limit +
        ', target: ' + params.content.length;
      return send(res, data);
    }

    try {
      var config = JSON.parse(params.config);
    } catch (e) {
      data.message = 'Parse config error. ' + e.message;
      return send(res, data);
    }

    if (!config.filelist)
      config.filelist = [{id: config.id, path: config.path}];

      var functions = [];

      _(config.filelist).each(function(file) {
        functions.push(function(callback) {
          var cfg = _(config).extend(file);
          delete cfg.filelist;

          var wd = new workerDispatcher(params.content, cfg);

          // 执行队列日志
          var log = new logger(wd.id);
          log.set({
            id: wd.id,
            start: new Date,
            appname: wd.config.appname,
            code: 0
          });

          wd.on('message', function(data) {
            data.result = native2ascii(data.result);
            log.set('code', 1);
            callback(null, data)
            return send(res, data);
          });

          wd.dispatch();
        });
      });

      require('async').parallel(functions, function(err, data) {
        if (err) {
          if (!rmsConfig.producing) throw ex;
          data.message = ex.message;
          return send(res, data);
        }
        //console.log(data);
      });
  });

  app.get('/status/:ids', function(req, res) {
    var ids = req.params.ids;
    if (!ids) return send(res, {});
    var obj = {};
    ids = ids.split('|')
    ids.forEach(function(id) {
      if (id) {
        obj[id] = logger.get(id);
      }
    });
    return send(res, obj);
  });

  app.listen(rmsConfig.api.port);
}
