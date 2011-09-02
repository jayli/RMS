// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Monitor.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var os = require('os');
var perfUsageTimer, results = [];

function start() {
  perfUsageTimer = setInterval(function() {
    perfUsage(results);
  }, 1000);
}

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

exports.start = start;
