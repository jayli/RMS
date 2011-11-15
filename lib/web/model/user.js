// vim: set sw=2 ts=2:

/**
 * @fileoverview 用户管理.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var client = db.client;

var User = function(obj) {
  _.defaults(this, obj);
};

User.prototype.update = function(callback) {
  var self = this;
  self.exist(function(exist) {
    db[exist ? 'lastModified' : 'insert'](
      'user', {
        name: self.name
      }, function(err, results, fields) {
        err && console.error(err);
        self.id = self.id || results[0] && results[0].id;
        callback.call(self, results);
      });
  });
};

User.prototype.exist = function(callback) {
  var self = this;
  client.query(
    'SELECT * FROM user WHERE name=?',
    [self.name],
    function(err, results, fields) {
      err && console.error(err);
      self.id = results[0] && results[0].id;
      callback.call(self, results.length !== 0);
    });
};

User.prototype.is = function(rolename, callback) {
  var self = this;
  client.query(
    'SELECT id FROM role WHERE name=? AND ' +
    'id=ANY(SELECT role_id FROM user_role WHERE ' +
    'user_id=(SELECT id FROM user WHERE name=?))',
    [rolename, self.name],
    function(err, results, fields) {
      err && console.error(err);
      callback.call(self, results.length !== 0);
    });
};

User.prototype.isRoot = function(callback) {
  this.is('root', callback);
};

User.prototype.isScm = function(callback) {
  this.is('scm', callback);
};

User.prototype.getRoles = function(callback) {
  var self = this;
  client.query(
    'SELECT * FROM role WHERE id=ANY(SELECT role_id FROM user_role' +
      ' WHERE user_id=(SELECT id FROM user WHERE name=?))',
    [self.name], function(err, results, fields) {
      err && console.error(err);
      results.forEach(function(role, idx) {
        var Role = require('./role');
        results[idx] = new Role({name: role.name});
      });
      callback.call(self, results);
    });
};

User.prototype.getApps = function(type, callback) {
  var self = this;
  self.isRoot(function(isroot) {
    var sql = 'SELECT * FROM app WHERE type=?';
    var params = [type];
    if (!isroot) {
      sql += ' AND id=ANY(SELECT target_id FROM role_permission' +
             ' WHERE action_id=3 AND role_id=ANY(' +
             'SELECT role_id FROM user_role WHERE user_id=?))';
      params.push(self.id);
    }

    client.query(sql, params, function(err, results, fields) {
        err && console.error(err);
        callback.call(self, results);
      });
  });
};

module.exports = User;
