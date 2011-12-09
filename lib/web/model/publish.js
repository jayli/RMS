// vim: set sw=2 ts=2:

/**
 * @fileoverview publish.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var client = db.client;

var Log = function(obj) {
  _(this).defaults(obj);
};

Log.prototype.add = function(ctx, callback) {
  var self = this;
  var obj = {
    user_id: ctx.user_id,
    action_id: self.actionId,
    target: self.target,
    target_id: ctx.target_id
  };
  obj = db.obj2flag(obj);
  client.query('INSERT INTO action_log SET ' + obj.flag, obj.value,
    function(err, results, fields) {
      callback.call(self, err);
    });
};

Log.prototype.get = function(by, id, callback) {
  var self = this;
  client.query('SELECT * FROM action_log WHERE ' + by + '=?', [id], function(err, results) {
    err && rmsUtil.error(err);
    callback.call(self, results);
  });
};

Log.prototype.getById = function(id, callback) {
  self.get('id', id, callback);
};

Log.prototype.getByAction = function(action, callback) {
  self.get('action_id', action, callback);
};

Log.prototype.getByTarget = function(target, callback) {
  self.get('target_id', target, callback);
};

Log.prototype.getByUser = function(user, callback) {
  self.get('user_id', user, callback);
};
