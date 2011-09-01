// vim: set sw=2 ts=2:

/**
 * @fileoverview Resource Management System.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var rmsConfig = require('./rmsConfig');
var rmsMonitor = require('./rmsMonitor');
var rmsService = require('./service');

rmsConfig.debug && rmsConfig.perf && rmsMonitor.start();

var webservice = require('webservice');
webservice.createServer(rmsService).listen(rmsConfig.api.port);
