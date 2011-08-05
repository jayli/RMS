// vim: set sw=2 ts=2:

/**
 * @fileoverview Worker Dispatcher.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */

var fs = require('fs');
var worker = require('webworker');

function workerDispatcher(content, config) {
  // fix current file absolute path
  var w = new worker(fs.realpathSync('lib/bridge.js'));
  w.onmessage = function(e) {
    sys.debug(sys.inspect(e));
    w.terminate();
  };
  w.postMessage({
    content: content,
    config: config
  });
}

moodule.exports = workerDispatcher;
