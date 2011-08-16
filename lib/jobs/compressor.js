// vim: set sw=2 ts=2:

/**
 * @fileoverview Compressor.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var asyncJob = require('../asyncJob');
var util = require('util');
var parser = require('uglify-js').parser;
var uglify = require('uglify-js').uglify;
var cleanCSS = require('clean-css');

function compressor() {
  asyncJob.apply(this, arguments);
  this.name = 'compressor';
}
util.inherits(compressor, asyncJob);


compressor.prototype.run = function(content, next) {
  if (this.config.type === 'JavaScript') {
    content = uglifyjsMinify(content);
  } else if (this.config.type === 'CSS') {
    content = cleanCSSMinfiy(content);
  } else {
  }
  next(content);
};


function uglifyjsMinify(content) {
  var ast = parser.parse(content);
  ast = uglify.ast_mangle(ast);
  ast = uglify.ast_squeeze(ast);
  return uglify.gen_code(ast);
}


function cleanCSSMinfiy(content) {
  return cleanCSS.process(content);
}

module.exports = compressor;
