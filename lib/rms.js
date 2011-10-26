// vim: set sw=2 ts=2:

/**
 * @fileoverview Resource Management System.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var rmsConfig = require('./rmsConfig');
var rmsMonitor = require('./monitor/rmsMonitor');
var rmsService = require('./service');
var webservice = require('webservice');

rmsMonitor.start();
webservice.createServer(rmsService).listen(rmsConfig.api.port);
