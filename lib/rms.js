// vim: set sw=2 ts=2:

/**
 * @fileoverview Resource Management System.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var webservice = require('webservice');
var rmsService = require('./service');
var rmsConfig = require('./rmsConfig');
var os = require('os');

webservice.createServer(rmsService).listen(rmsConfig.api.port);

var perfUsageTimer, usage, results = [];
perfUsageTimer = setInterval(function() {
  perfUsage(results);
}, 1000);


function perfUsage(results) {
  var mem = process.memoryUsage();
  var cpus = [];
  os.cpus().forEach(function(cpu) {
    cpus.push(cpu.times.user);
  });
  var loadavg = os.loadavg();

  results.push([
    mem['rss'],
    mem['vsize'],
    mem['heapTotal'],
    mem['heapUsed']
  ].concat(cpus, loadavg));

  console.log(results[results.length - 1].join('\t'));
}
