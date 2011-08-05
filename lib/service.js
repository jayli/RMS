// vim: set sw=2 ts=2:

/**
 * @fileoverview RESTful webservice API.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var Worker = require('./workerDispatcher');

this.title = 'Resource Management System';
this.name = 'Async Workflow';
this.version = '0.0.3';
this.endpoint = 'http://trade.ued.taobao.net:8080';

exports.precompile = function(options, callback) {
  try {
    var config = JSON.parse(options.config);
    var worker = new Worker(options.content, config);
    worker.on('message', function(e) {
      callback(null, JSON.stringify(e.data));
    });
    worker.dispatch();
  } catch (e) {
    var data = {
      result: options.content,
      success: false
    };
    callback(null, JSON.stringify(data));
  }
};

exports.precompile.description = 'RMS pre-compiling service.';
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
