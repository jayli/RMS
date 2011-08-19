// vim: set sw=2 ts=2:

/**
 * @fileoverview Resource Management System.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var webservice = require('webservice');
var rmsService = require('./service');
var rmsConfig = require('./config');

webservice.createServer(rmsService).listen(rmsConfig.api.port);

var memoryUsageTimer, usage, results = [];
memoryUsageTimer = setInterval(function() {
  memoryUsage(results);
}, 1000);


function memoryUsage(results) {
  var usage = process.memoryUsage();
  results.push([
    usage['rss'] / 1000000,
    usage['vsize'] / 1000000,
    usage['heapTotal'] / 1000000,
    usage['heapUsed'] / 1000000
  ]);
  console.log('memory: %s', results[results.length - 1].join('\t'));
}
