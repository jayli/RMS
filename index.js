// vim: set sw=2 ts=2:

/**
 * @fileoverview Resource Management System.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var forever = require('forever');
var rmsUtil = require('./lib/rmsUtil');

function deploy(type) {
  forever[rmsUtil.producing ? 'startDaemon' : 'start'](
      __dirname + '/lib/' + type + '/index.js');
}

var target = process.argv[2];
if (target) {
  deploy(target);
} else {
  console.log('Usage: node index.js {service|web}');
}
