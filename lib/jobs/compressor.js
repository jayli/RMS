// vim: set sw=2 ts=2:

/**
 * @fileoverview Compressor.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var asyncJob = require('../asyncJob');
var util = require('util');
var parser = require('uglify-js').parser;
var uglify = require('uglify-js').uglify;

function compressor() {
  asyncJob.apply(this, arguments);
  this.name = 'compressor';
}
util.inherits(compressor, asyncJob);


compressor.prototype.run = function(content, next) {
  if (this.config.type === 'JavaScript') {
    var ast = parser.parse(content);
    ast = uglify.ast_mangle(ast);
    ast = uglify.ast_squeeze(ast);
    content = uglify.gen_code(ast);
    next(content);
  } else {
    next(content);
  }
};

module.exports = compressor;
