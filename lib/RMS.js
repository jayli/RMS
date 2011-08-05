// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Pre-process System.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var webservice = require('webservice');
var workerModule = require('./service');

webservice.createServer(workerModule).listen(8080);
console.log(' > start RMS service..');
