// vim: set sw=2 ts=2:

/**
 * @fileoverview Mustache for Express.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var mustache = require('mustache').to_html;

exports.compile = function(source, options) {
  if (typeof source == 'string') {
    return function(options) {
      options.locals = options.locals || {};
      options.partials = options.partials || {};
      if (options.body) // for express.js > v1.0
        locals.body = options.body;
      return mustache(source, options.locals, options.partials);
    };
  } else {
    return source;
  }
};

exports.render = function(template, options) {
  template = this.compile(template, options);
  return template(options);
};
