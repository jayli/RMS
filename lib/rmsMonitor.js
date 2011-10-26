// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Monitor.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var os = require('os');
var fs = require('fs');
var rmsConfig = require('./rmsConfig');
var emitter = new (require('events').EventEmitter)();

var app = require('express').createServer();
var io = require('socket.io').listen(app);

var perfUsageTimer, results = [];
var date = getDate();
var readStream, writeStream;

app.listen(rmsConfig.monitor.port);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/monitor/index.html');
});

io.sockets.on('connection', function(socket) {
  emitter.on('perf', function(line) {
    socket.emit('data', line.toString().split(/\s+/));
  });
});

emitter.on('perf', function(line) {
  var out = getWriteStream();
  out.write(line + '\n');
});

function perfUsage() {
  var cpus = [];
  os.cpus().forEach(function(cpu) {
    cpus.push(cpu.times.user);
  });
  var mem = process.memoryUsage();

  emitter.emit('perf', [+new Date].concat([
    mem['rss'],
    mem['vsize'],
    mem['heapTotal'],
    mem['heapUsed']
  ], os.loadavg(), cpus).join('\t'));
}


function getDate() {
  var now = new Date();
  return now.getFullYear() + '-' + now.getMonth() + '-' + now.getDay();
}

function getWriteStream() {
  var today = getDate();
  if (!writeStream || today != date) {
    if (writeStream) writeStream.end();
    writeStream = fs.createWriteStream('/tmp/' + date + '.log');
  }
  return writeStream;
}

function getReadStream() {
  var today = getDate();
  if (!readStream || today != date) {
    readStream = fs.createReadStream('/tmp/' + date + '.log');
  }
  return readStream;
}

exports.start = function() {
  perfUsageTimer = setInterval(function() {
    perfUsage();
  }, rmsConfig.monitor.interval);
};
