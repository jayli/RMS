// vim: set sw=2 ts=2:

/**
 * @fileoverview Syntax Checker.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */
var rmsUtil = require('../../rmsUtil');
var parser = require('uglify-js').parser;

var syntaxChecker = module.exports = rmsUtil.createJob('syntaxChecker');

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
