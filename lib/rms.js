// vim: set sw=2 ts=2:

/**
 * @fileoverview Resource Management System.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var webservice = require('webservice');
var rmsService = require('./service');
var rmsConfig = require('./rmsConfig');
var rmsMonitor = require('./rmsMonitor');

rmsConfig.debug && rmsConfig.perf && rmsMonitor.start();
webservice.createServer(rmsService).listen(rmsConfig.api.port);
