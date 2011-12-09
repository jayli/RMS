// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布日志.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var client = db.client;

var pubLog = function(obj) {
  _(this).defaults(obj);
};

pubLog.prototype.getBy = function(filter, id, callback) {
};

pubLog.prototype.getByAppId = function(appid, callback) {
  var self = this;
};

pubLog.prototype.getByUserId = function(userid, callback) {
  var self = this;
};

pubLog.prototype.save = function() {
  var self = this;
};
