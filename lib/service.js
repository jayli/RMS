// vim: set sw=2 ts=2:

/**
 * @fileoverview RESTful webservice API.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var WorkerDispatcher = require('./workerDispatcher');
var rmsConfig = require('./rmsConfig');

this.title = rmsConfig.title;
this.name = rmsConfig.name;
this.version = rmsConfig.api.version;
this.endpoint = rmsConfig.api.endpoint;

exports.precompile = function(options, callback) {
  var srvTime = +new Date;
  try {
    var config = JSON.parse(options.config);
  } catch (e) {
    var data = {
      result: options.content,
      message: 'Config parse error. ' + e.message,
      success: false
    };
    callback(null, JSON.stringify(data));
    return;
  }

  try {
    var wd = new WorkerDispatcher(options.content, config);
    wd.on('message', function(data) {
      callback(null, JSON.stringify(data));
    });
    wd.dispatch();
  } catch (ex) {
    var data = {
      result: options.content,
      success: false,
      message: ex.message
    };
    callback(null, JSON.stringify(data));
    return;
  }
};

exports.precompile.description = 'Resource Management System';
exports.precompile.schema = {
  content: {
    type: 'string',
    optional: false
  },
  config: {
    type: 'json',
    optional: false
  }
};
