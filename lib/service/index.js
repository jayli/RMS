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
  var app = express.createServer()
    .use(express.bodyParser())
    .set('jsonp callback', true);

  app.all('/precompile', function(req, res) {
    var params = req.body;
    var data = {
      result: params.content,
      success: false
    };

    // TODO 这部分需要挪到workflow里去限制
    /*
    var limit = rmsConfig.filesizeLimit || 10485760;
    if (params.content.length > limit) {
      data.message = 'Filesize too large, limit: ' + limit +
        ', target: ' + params.content.length;
      return send(res, data);
    }
    */

    try {
      var config = JSON.parse(params.config);
    } catch (e) {
      data.message = 'Parse config error. ' + e.message;
      return send(res, data);
    }

    config.async && send(res, {
      result: '',
      rmsUtil: true,
      message: 'Async worker started.'
    });

    var functions = [];

    _(config.filelist).each(function(path, idx) {
      functions.push(function(callback) {
        var cfg = _(config).extend({
          id: idx
        , path: path.svnpath
        , type: rmsUtil.getFileType(path.svnpath)
        });
        delete cfg.filelist;

        var wd = new workerDispatcher(params.content, cfg);

        /*
        if (!_.isEmpty(logger.get(wd.id))) {
          return callback(null, {
            id: idx,
            success: true,
            code: 1,
            message: 'this file has already been processed',
          });
        }
        */

        var log = new logger(wd.id);
        log.set({
          id: wd.id,
          start: new Date,
          path: wd.config.path,
          appname: wd.config.appname,
          code: 0
        });

        wd.on('message', function(data) {
          if (!data.success) {
            return callback(new Error(data.message), null);
          }
          if (this.config.type === 'JavaScript' || this.config.type === 'CSS')
            data.result = native2ascii(data.result || '');
          log.set('code', 1);
          data.path = path;
          callback(null, data);
        });

        wd.dispatch();
      });
    });

    require('async').parallel(functions, function(err, data) {
      if (err && !rmsConfig.producing) throw err;
      var filelist = {};
      _(data).each(function(o) {
        filelist[o.path.filepath] = o.result;
      });
      store.writeFiles(config.appname, filelist, config.pubtype);
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
