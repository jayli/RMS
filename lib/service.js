// vim: set sw=2 ts=2:

/**
 * @fileoverview RESTful webservice API.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var Worker = require('./workerDispatcher');
var rmsConfig = require('./config');

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
    var worker = new Worker(options.content, config);
    worker.on('message', function(e) {
      callback(null, JSON.stringify(e.data));
      // console.log('srvTime: %s ms', +new Date - srvTime);
    });
    worker.dispatch();
  } catch (e) {
    var data = {
      result: options.content,
      success: false,
      message: e.message
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
