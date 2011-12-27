// vim: set sw=2 ts=2:

/**
 * @fileoverview 角色管理.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var rmsUtil = require('../../rmsUtil');
var client = db.client;

var Role = function(obj) {
  _(this).defaults(obj);
};

Role.addRole = function(name, callback) {
  new Role({name: name}).update(callback);
};

Role.prototype.update = function(callback) {
  var self = this;
  self.exist(function(exist) {
    if (exist) {
      client.query('UPDATE role SET name=?, gmt_modified=? WHERE id=?',
        [self.name, new Date, self.id], function(err, results, fields) {
          callback.call(self);
        });
    } else {
      db.insert('role', {name: self.name}, function(err, results) {
        err && rmsUtil.error(err);
        callback.call(self);
      });
    }
  });
};

Role.prototype.del = function(callback) {
  var self = this;
  var sql = 'DELETE FROM role WHERE ';
  if (self.id) {
    sql += 'id=?';
    val = [self.id];
  } else {
    sql += 'name=?';
    val = [self.name];
  }
  client.query(sql, val, function(err, results, fields) {
    err && rmsUtil.error(err);
    callback.call(self);
  });
};

Role.prototype.exist = function(callback) {
  var self = this;
  var sql = 'SELECT * FROM role WHERE ';
  if (self.id) {
    sql += 'id=?';
    val = [self.id];
  } else {
    sql += 'name=?';
    val = [self.name];
  }
  client.query(sql, val, function(err, results, fields) {
    err && rmsUtil.error(err);
    var exist = results && results.length !== 0;
    callback.call(self, exist, results);
  });
};

Role.prototype.getUsers = function(callback) {
  var self = this;
  client.query(
    'SELECT * FROM user WHERE id=ANY(SELECT user_id FROM user_role' +
      ' WHERE role_id=ANY(SELECT id FROM role WHERE name=?))',
    [self.name], function(err, results, fields) {
      err && rmsUtil.error(err);
      callback.call(self, results);
    });
};

Role.prototype.getApps = function(callback) {
  var self = this;
  client.query(
    'SELECT * FROM app WHERE id=ANY(SELECT app_id FROM role_permission' +
      ' WHERE action_id=3 AND role_id=ANY(SELECT id FROM role WHERE name=?))',
    [self.name], function(err, results, fields) {
      err && rmsUtil.error(err);
      callback.call(self, results);
    });
};

Role.prototype.addUser = function(name, callback) {
  var self = this;
  var User = Model('user');
  new User({name: name}).exist(function(exist) {
    var user = this;
    if (!exist) {
      return User.addUser(name, function() {
        self.addUser(name, callback);
      });
    }
    var obj = {
      role_id: self.id,
      user_id: user.id
    };
    var sObj = db.formatObj(obj, {split: ' AND '});
    client.query(
      'SELECT id FROM user_role WHERE ' + sObj.flag,
      sObj.value, function(err, results, fields) {
        if (results && results.length > 0) {
          return callback.call(self);
        }
        db.insert('user_role ', obj, function(err, results, fields) {
          callback.call(self, results);
        });
      });
  });
};

Role.prototype.removeUser = function(id, callback) {
  var self = this;
  var obj = db.formatObj({
    user_id: +id,
    role_id: +self.id
  }, {
    split: ' AND '
  });
  client.query(
    'DELETE FROM user_role WHERE ' + obj.flag,
    obj.value, function(err, results) {
      err && rmsUtil.error(err);
      callback.call(self);
    });
};

Role.getAll = function(filter, callback) {
  var self = this, sql = '';
  if (_.isFunction(filter)) {
    callback = filter;
    filter = [];
  }
  if (filter.length > 0) {
    filter = _.map(filter, function(item) {
      return '"' + item + '"';
    });
    sql = ' WHERE name NOT IN (' + filter.join(',') + ')';
  }
  client.query(
    'SELECT * FROM role' + sql,
    function(err, results, fields) {
      err && rmsUtil.error(err);
      callback.call(self, results);
    });
};

module.exports = Role;
