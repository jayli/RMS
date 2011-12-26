// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布日志.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

global._ = require('underscore');
global.RmsUtil = require('../../rmsUtil');

var async = require('async');
var db = require('../database');
var client = db.client;

var SERVICE_LOG = 'service_log';
var ACTION_LOG = 'action_log'
var OBJECT_ATTR = ['config'];

var serviceLog = function(obj) {
  obj = _(obj).defaults({
    status: 0
  , config: {}
  });
  _(this).defaults(obj);
};

serviceLog.unSerialize = function(obj) {
  _(obj).map(function(v, k) {
    if (OBJECT_ATTR.indexOf(k) === -1) return;
    obj[k] = JSON.stringify(v);
  });
  return obj;
};

serviceLog.serialize = function(obj) {
  _(obj).map(function(v, k) {
    if (OBJECT_ATTR.indexOf(k) === -1) return;
    obj[k] = JSON.parse(v);
  });
  return obj;
};

serviceLog.getByOperId = function(operId, callback) {
  db.select(SERVICE_LOG, '*', {oper_id: operId}, function(err, results) {
    err && RmsUtil.error(err);
    if (!results || results.length === 0) return;
    var obj = serviceLog.serialize(results[0]);
    callback(err, new serviceLog(obj));
  });
};

serviceLog.prototype.save = function(obj, callback) {
  var self = this;
  RmsUtil.log('Update service log %s', self.oper_id);
  _(self).extend(obj);
  var cb = function(err, results) {
    err && RmsUtil.error(err);
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
      db.insert(SERVICE_LOG, serviceLog.unSerialize({
        oper_id: self.oper_id
      , config: self.config
      , status: self.status
      }), cb);
    }
  , function(exists, next) {
      db.update(SERVICE_LOG, {
        oper_id: self.oper_id
      }, serviceLog.unSerialize({
        status: self.status
      , oper_end: self.complete ? new Date : null
      }), cb);
    }
  ]);
};

var actionLog = function(obj) {
  _(this).defaults(obj);
};

actionLog.pageCount = function(conditions, perPage, callback) {
  db.select(ACTION_LOG, 'count(id)', conditions, function(err, results) {
    return callback(err, Math.ceil(results.length > 0 ?
      (results[0]['count(id)'] / perPage): 0));
  });
};

actionLog.getBy = function(conditions, page, perPage, callback) {
  var start = (page - 1) * perPage;

  // 先查询action_log获取app_id, user_id, oper_id
  async.waterfall([
    function(next) {
      db.select(ACTION_LOG, '*', conditions,
        'ORDER BY id DESC LIMIT ' + start + ',' + perPage, function(err, results, fields) {
          if (results.length === 0) return callback(null, results);
          next(err, results);
        });
    }
  , function(results) {
      var createHandler = function(key, cb) {
        return function(err, o) {
          err && RmsUtil.error(err);
          var obj = {};
          o.forEach(function(v, k) {
            obj[v[key]] = v;
          });
          cb(err, obj);
        };
      };

      // 再并行请求logs/user/app的信息
      async.parallel({
        logs: function(cb) {
          var opers = [];
          results.forEach(function(item) {
            opers.push('\'' + item.oper_id + '\'');
          });
          client.query(
            'SELECT * FROM ' + SERVICE_LOG +
            ' WHERE oper_id in (' + opers.join(',') + ')',
            createHandler('oper_id', cb));
        }
      , userlist: function(cb) {
          var users = [];
          results.forEach(function(result) {
            users.push(result.user_id);
          });
          client.query(
            'SELECT * FROM user WHERE id in (' + users.join(',') + ')',
            createHandler('id', cb));
        }
      , apps: function(cb) {
          var apps = [];
          results.forEach(function(result) {
            apps.push(result.app_id);
          });
          client.query(
            'SELECT * FROM app WHERE id in (' + apps.join(',') + ')',
            createHandler('id', cb));
        }
      }, function(err, data) {
        var logs = data.logs;
        var userlist = data.userlist;
        var apps = data.apps;
        results.forEach(function(v, k) {
          results[k].service_log = serviceLog.serialize(logs[v.oper_id]);
          results[k].user = userlist[v.user_id];
          results[k].app = apps[v.app_id];
        });
        callback(err, results);
      });
    }
  ]);
};

actionLog.prototype.save = function(callback) {
  var self = this;
  RmsUtil.log('Update action log operId: %s, userId: %s, appId: %s',
    self.oper_id, self.user_id, self.app_id);
  var cb = function(err, results) {
    err && RmsUtil.error(err);
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

exports.serviceLog = serviceLog;
exports.actionLog = actionLog;
