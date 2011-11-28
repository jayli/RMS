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
  o[part] = fs.readFileSync(path.join(
      App.settings.views,
      part + '.mustache')).toString();
  res._locals = res._locals || {};
  res._locals.partials = res._locals.partials || {};

  res.local(part, true);
  res.local('partials', _.extend(res._locals.partials, o));
};

WebUtil.error = function(res, message) {
  res.local('error', message);
  return res.render('error');
};

WebUtil.isTxt = function(exts) {
  return new RegExp('\.(' + config.txtExts.join('|') + ')').test(exts);
};

WebUtil.isImg = function(exts) {
  return new RegExp('\.(' + config.imgExts.join('|') + ')').test(exts);
};

WebUtil.model = function(model) {
  return require('./model/' + model);
};
