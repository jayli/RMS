// vim: set sw=2 ts=2:

/**
 * @fileoverview Resource Management System.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var express = require('express');
var cluster = require('cluster');

var workerDispatcher = require('./workerDispatcher');
var rmsConfig = require('../rmsConfig');
var rmsUtil = require('../rmsUtil');

var rmsMonitor = require('../monitor/rmsMonitor');
rmsMonitor.start(rmsConfig.monitor);

if (rmsUtil.producing) {
  cluster.on('death', function(worker) {
    console.error('%s is dead.', worker.pid);
    cluster.fork().on('message', clusterCallback);
  });

  if (cluster.isMaster) {
    var maxWorker = rmsConfig.maxWorker || 8;
    while (maxWorker--) {
      cluster.fork().on('message', clusterCallback);
    }
  } else {
    startService();
  }
} else {
  console.log('start rms service in development mode.');
  startService();
}


function clusterCallback(o) {}

function send(res, data) {
  res.send(data);
  rmsUtil.producing && process.send(1);
}

function startService() {
  var native2ascii = require('native2ascii').native2ascii;
  var app = express.createServer().use(express.bodyParser());
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
      data.message = 'Config parse error. ' + e.message;
      return send(res, data);
    }

    try {
      var wd = new workerDispatcher(params.content, config);
      wd.on('message', function(data) {
        data.result = native2ascii(data.result);
        return send(res, data);
      });
      wd.dispatch();
    } catch (ex) {
      if (!rmsUtil.producing) throw ex;
      data.message = ex.message;
      return send(res, data);
    }
  });
  app.listen(rmsConfig.api.port);
}
