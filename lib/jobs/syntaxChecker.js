// vim: set sw=2 ts=2:

/**
 * @fileoverview Syntax Checker.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */
var asyncJob = require('../asyncJob');
var util = require('util');

function syntaxChecker() {
  asyncJob.apply(this, arguments);
  this.name = 'syntaxChecker';
}
util.inherits(syntaxChecker, asyncJob);


syntaxChecker.prototype.run = function(next) {
  console.log(this.name);
  next();
};

module.exports = syntaxChecker;
