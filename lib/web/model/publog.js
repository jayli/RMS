// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布日志.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var async = require('async');
var db = require('../database');
var client = db.client;

var pubLog = function(obj) {
  obj = _(obj).defaults({
    statuses: {}
  , configure: {}
  });
  _(this).defaults(obj);
};

pubLog.prototype.getByOperId = function(operId, callback) {
  var self = this;
};

pubLog.prototype.save = function(statuses, callback) {
  var self = this;
  self.statuses = statuses || self.statuses;
  var cb = function(err, results) {
    err && rmsUtil.error(err);
    callback(results);
  };
  async.waterfall([
    function(next) {
      client.query('SELECT count(id) FROM service_log WHERE oper_id=?',
        [self.id], function(err, results) {
          next(err, results[0]['count(id)'] > 0);
        });
    }
  , function(exists, next) {
      if (exists) return next(null, exists);
      db.insert('service_log', {
        oper_id: self.id
      , configure: JSON.stringify(self.configure)
      , statuses: JSON.stringify(self.statuses)
      , start: new Date
      }, cb);
    }
  , function(exists, next) {
      db.update('service_log', {
        oper_id: self.id
      }, {
        statuses: JSON.stringify(self.statuses)
      , end: self.statuses.complete ? new Date : null
      }, cb);
    }
  ]);
};
