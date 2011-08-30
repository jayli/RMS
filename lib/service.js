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

exports.precompile = function(params, callback) {
  var data = {
    result: params.content,
    success: false
  };
  var limit = rmsConfig.filesizeLimit || 1048576;
  if (params.content.length > limit) {
    data.message = 'Filesize too large, limit: ' + limit +
          ', target: ' + params.content.length;
    console.error(data.message);
    return callback(null, JSON.stringify(data));
  }

  try {
    var config = JSON.parse(params.config);
  } catch (e) {
    data.message = 'Config parse error. ' + e.message;
    return callback(null, JSON.stringify(data));
  }

  try {
    var wd = new WorkerDispatcher(params.content, config);
    wd.on('message', function(data) {
      callback(null, JSON.stringify(data));
    });
    wd.dispatch();
  } catch (ex) {
    data.message = ex.message;
    return callback(null, JSON.stringify(data));
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
