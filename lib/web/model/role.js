// vim: set sw=2 ts=2:

/**
 * @fileoverview 角色管理.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var client = db.client;

var Role = function(obj) {
  _.defaults(this, obj);
};

Role.prototype.update = function(callback) {
  var self = this;
  self.exist(function(exist) {
    db[exist ? 'lastModified' : 'insert'](
      'user', {
        name: self.name
      }, function(err, results) {
        err && console.error(error);
        callback.call(self, results);
      });
  });
};

Role.prototype.exist = function(callback) {
  var self = this;
  client.query(
    'SELECT * FROM role WHERE name=?',
    [self.name],
    function(err, results, fields) {
      err && console.error(err);
      callback.call(self, results.length !== 0);
    });
};

Role.prototype.getUsers = function(callback) {
  var self = this;
  client.query(
    'SELECT * FROM user WHERE id=ANY(SELECT user_id FROM user_role' +
      ' WHERE role_id=(SELECT id FROM role WHERE name=?))',
    [self.name], function(err, results, fields) {
      err && console.error(err);
      results.forEach(function(user, idx) {
        var User = require('./user');
        results[idx] = new User({name: user.name});
      });
      callback.call(self, results);
    });
};

Role.prototype.getApps = function(callback) {
  var self = this;
  client.query(
    'SELECT * FROM app WHERE id=ANY(SELECT target_id FROM role_permission' +
      ' WHERE action_id=3 AND role_id=(SELECT id FROM role WHERE name=?))',
    [self.name], function(err, results, fields) {
      err && console.error(err);
      callback.call(self, results);
    });
};

module.exports = Role;
