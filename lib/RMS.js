// vim: set sw=2 ts=2:

/**
 * @fileoverview Resource Management System.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var webservice = require('webservice');
var workerModule = require('./service');
var rmsConfig = require('./config');

webservice.createServer(workerModule).listen(rmsConfig.api.port);
console.log(' > start RMS service in 8080..');
