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

User.addUser = function(name, callback) {
  new User({name: name}).update(callback);
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
        self.getRoles(function(roles) {
          self.roles = roles;
          roles.some(function(role) {
            if (role.name === 'root') {
              self.isroot = true;
              return false;
            }
          });
          callback.call(self, results);
        });
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

User.prototype.is = function(rolenames, callback) {
  var self = this;
  if (typeof rolenames == 'string')
    rolenames = rolenames.trim().split(/\s*,\s*/);

  self.getRoles(function(roles) {
    var match = false;
    for (var j = 0, k = roles.length; j < k; j++) {
      var role = roles[j];
      for (var i = 0, l = rolenames.length; i < l; i++) {
        if (rolenames[i] == role.name) {
          match = true;
          break;
        }
      }
    }
    callback.call(self, match);
  });
};

User.prototype.isRoot = function(callback) {
  this.is(['root'], callback);
};

User.prototype.isAdmin = function(callback) {
  this.is(['scm', 'root'], callback);
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
        results[idx] = new Role({
          id: role.id,
          name: role.name
        });
      });
      callback.call(self, results);
    });
};

User.prototype.getApps = function(type, callback) {
  var self = this;

  if (_.isFunction(type)) {
    callback = type;
    type = '';
  }

  self.isAdmin(function(isroot) {
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
