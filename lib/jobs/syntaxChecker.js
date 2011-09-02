// vim: set sw=2 ts=2:

/**
 * @fileoverview Syntax Checker.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var asyncJob = require('../asyncJob');
var util = require('util');
var parser = require('uglify-js').parser;

function syntaxChecker() {
  asyncJob.apply(this, arguments);
  this.name = 'syntaxChecker';
}
util.inherits(syntaxChecker, asyncJob);


syntaxChecker.prototype.run = function(content, next) {
  // syntaxChecker only support JavaScript currently.
  if (this.config.type === 'JavaScript') {
    try {
      parser.parse(content);
      next(content);
    } catch (e) {
      next(null, e);
    }
  } else {
    // just ignore other filetype
    next(content);
  }
};

module.exports = syntaxChecker;
