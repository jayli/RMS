// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web Util.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var fs = require('fs');
var path = require('path');
var util = require('util');
var config = require('./config');
var WebUtil = exports;

WebUtil.partial = function(res, part) {
  var o = {};
  o[part] = fs.readFileSync(
    path.join(App.settings.views, part + '.mustache')).toString();
  res._locals = res._locals || {};
  res._locals.partials = res._locals.partials || {};

  res.local(part, true);
  res.local('partials', _.extend(res._locals.partials, o));
};

WebUtil.render = function(res, partial) {
  var mustache = require('mustache').to_html;
  WebUtil.partial(res, 'pageHeader');
  WebUtil.partial(res, partial);
  res.send(mustache(
    '{{>header}}{{#' +
    partial +
    '}}{{>' +
    partial +
    '}}{{/' +
    partial +
    '}}{{>footer}}',
    res._locals,
    res._locals.partials));
};

WebUtil.error = function(res, message) {
  res.local('error', message);
  return res.render('error');
};

WebUtil.pagination = function(res, page, count, callback) {
  if (count <= 1) return callback(null, res);
  WebUtil.partial(res, 'pagination');
  var perPage = WebConfig.pagination.itemPerPage;
  var max = WebConfig.pagination.pageNumAtOneTime;
  var pages = [];
  var pagesCount = Math.min(count, max);
  var start = page - (max / 2 - 1) > 0 ? page - (max / 2 - 1) : 1;
  var end = start + max - 1;
  _(pagesCount).times(function() {
    pages.push({
      active: start === page
    , count: start++
    });
  });
  res.local('pagination', {
    prevPage: Math.max(page - 1, 1)
  , nextPage: Math.min(page + 1, count)
  , disablePrev: page - 1 < 1
  , disableNext: page + 1 > count
  , pages: pages
  });
  callback(null, res);
};

WebUtil.model = function(model) {
  return require('./model/' + model);
};

WebUtil.controller = function(controller) {
  return require('./controller/' + controller);
};

WebUtil.TestDBConnection = function(cb) {
  require('./database').client.ping(cb);
};
