// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布日志.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var async = require('async');
var db = require('../database');
var client = db.client;

var SERVICE_LOG = 'service_log';
var ACTION_LOG = 'action_log'
var OBJECT_ATTR = ['configure', 'statuses'];

var serviceLog = function(obj) {
  obj = _(obj).defaults({
    statuses: {}
  , configure: {}
  });
  _(this).defaults(obj);
};

serviceLog.convertFromDataSet = function(obj) {
  _(obj).map(function(v, k) {
    if (OBJECT_ATTR.indexOf(k) === -1) return;
    obj[k] = JSON.parse(v);
  });
  return obj;
};

serviceLog.getByOperId = function(operId, callback) {
  db.select(SERVICE_LOG, '*', {oper_id: operId}, function(err, results) {
    err && rmsUtil.error(err);
    if (!results || results.length === 0) return;
    var obj = serviceLog.convertFromDataSet(results[0]);
    callback(err, new serviceLog(obj));
  });
};

serviceLog.prototype.save = function(statuses, callback) {
  var self = this;
  self.statuses = statuses || self.statuses;
  var cb = function(err, results) {
    err && rmsUtil.error(err);
    callback(results);
  };
  async.waterfall([
    function(next) {
      db.select(SERVICE_LOG, 'count(id)', {
        oper_id: self.oper_id
      }, function(err, results) {
        next(err, results[0]['count(id)'] > 0);
      });
    }
  , function(exists, next) {
      if (exists) return next(null, exists);
      db.insert(SERVICE_LOG, {
        oper_id: self.oper_id
      , configure: JSON.stringify(self.configure)
      , statuses: JSON.stringify(self.statuses)
      }, cb);
    }
  , function(exists, next) {
      db.update(SERVICE_LOG, {
        oper_id: self.oper_id
      }, {
        statuses: JSON.stringify(self.statuses)
      , end: self.statuses.complete ? new Date : null
      }, cb);
    }
  ]);
};

var actionLog = function(obj) {
  _(this).defaults(obj);
};

actionLog.getBy = function(conditions, page, perPage, callback) {
  var start = (page - 1) * perPage;
  async.waterfall([
    function(next) {
      db.select(ACTION_LOG, '*', conditions,
        'LIMIT ' + start + ',' + perPage, next);
    }
  , function(results, next) {
      var opers = [];
      results.forEach(function(item) {
        opers.push('\'' + item.oper_id + '\'');
      });
      client.query('SELECT * FROM ' + SERVICE_LOG +
        ' WHERE oper_id in (' + opers.join(',') + ')', function(err, logs) {
          err && rmsUtil.error(err);
          var obj = {};
          logs.forEach(function(v, k) {
            obj[v.oper_id] = v;
          });
          results.forEach(function(v, k) {
            results[k].service_log = serviceLog.convertFromDataSet(obj[v.oper_id]);
          });
          callback(err, results);
        });
    }
  ]);
};

actionLog.prototype.save = function(callback) {
  var self = this;
  var cb = function(err, results) {
    err && rmsUtil.error(err);
    callback(results);
  };
  async.waterfall([
    function(next) {
      db.select(ACTION_LOG, 'count(id)', {
        oper_id: self.oper_id
      }, function(err, results) {
        next(err, results[0]['count(id)'] > 0);
      });
    }
  , function(exists, next) {
      if (exists) return cb(null);
      db.insert(ACTION_LOG, {
        user_id: self.user_id
      , oper_id: self.oper_id
      , app_id: self.app_id
      }, cb);
    }
  ]);
};
