// vim: set sw=2 ts=2:

/**
 * @fileoverview Mustache for Express.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var mustache = require('mustache').to_html;

exports.compile = function(source, options) {
  if (typeof source == 'string') {
    return function(options) {
      options.partials = options.partials || {};
      if (options.body)
        locals.body = options.body;
      return mustache(source, options, options.partials);
    };
  } else {
    return source;
  }
};
