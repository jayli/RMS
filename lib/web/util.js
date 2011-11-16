// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web Util.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var fs = require('fs');
var path = require('path');
var util = require('util');
var config = require('./config');

exports.partial = function(res, part) {
  var o = {};
  o[part] = fs.readFileSync(path.join(
      App.settings.views,
      part + '.mustache')).toString();
  res._locals = res._locals || {};
  res._locals.partials = res._locals.partials || {};
  res.local('partials', _.extend(res._locals.partials, o));
};

var txtExts = config.txtExts;
exports.isTxt = function(exts) {
  return new RegExp('\.(' + txtExts.join('|') + ')').test(exts);
};

var imgExts = config.imgExts;
exports.isImg = function(exts) {
  return new RegExp('\.(' + imgExts.join('|') + ')').test(exts);
};

exports.model = function(model) {
  return require('./model/' + model);
};
