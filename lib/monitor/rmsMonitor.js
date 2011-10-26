// vim: set sw=2 ts=2:

/**
 * @fileoverview Simple Node Monitor.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var os = require('os');
var fs = require('fs');
var emitter = new (require('events').EventEmitter)();

var perfUsageTimer, results = [];
var date = getDate();
var readStream, writeStream;

emitter.on('perf', function(line) {
  getWriteStream().write(line + '\n');
});

function perfUsage() {
  var cpus = [];
  os.cpus().forEach(function(cpu) {
    cpus.push(cpu.times.user);
  });
  var mem = process.memoryUsage();

  // timestamp rss vsize heapTotal heapUsed 1min 5min 15min cpus..
  emitter.emit('perf', [+new Date].concat([
    mem['rss'],
    mem['vsize'],
    mem['heapTotal'],
    mem['heapUsed']
  ], os.loadavg(), cpus).join('\t'));
}

function getDate() {
  var now = new Date();
  return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
}

function getWriteStream() {
  var today = getDate();
  if (!writeStream || today != date) {
    if (writeStream) writeStream.end();
    writeStream = fs.createWriteStream('/tmp/' + date + '.log');
  }
  return writeStream;
}

exports.start = function(opt) {
  setInterval(perfUsage, opt.interval);

  var port = opt.port || 8089;
  var app = require('express').createServer();

  if (opt.realtime) {
    var io = require('socket.io').listen(app);
    app.listen(port);

    io.sockets.on('connection', function(socket) {
      emitter.on('perf', function(line) {
        socket.emit('data', line.toString().split(/\s+/));
      });
    });

    app.get('/', function(req, res) {
      res.sendfile(__dirname + '/index.html');
    });
  }
};
