// vim: set sw=2 ts=2:

/**
 * @fileoverview Compressor.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var asyncJob = require('../asyncJob');
var util = require('util');

function compressor() {
  asyncJob.apply(this, arguments);
  this.name = 'compressor';
}
util.inherits(compressor, asyncJob);


compressor.prototype.run = function(next) {
  next();
};

module.exports = compressor;
