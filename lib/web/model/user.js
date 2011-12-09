// vim: set sw=2 ts=2:

/**
 * @fileoverview 用户管理.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var client = db.client;

var User = function(obj) {
  _(this).defaults(obj);
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
        err && rmsUtil.error(err);
        self.id = self.id || results[0] && results[0].id;
        self.getRoles(function(roles) {
          self.roles = roles;
          self.isRoot(function(isroot) {
            self.isroot = isroot;
          });
          self.isAdmin(function(isadmin) {
            self.isadmin = isadmin;
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
      err && rmsUtil.error(err);
      self.id = results[0] && results[0].id;
      callback.call(self, results.length !== 0);
    });
};

User.prototype.is = function(rolenames, callback) {
  var self = this;
  if (typeof rolenames == 'string')
    rolenames = rolenames.trim().split(/\s*,\s*/);

  function cb(roles) {
    var match = _.any(roles, function(role) {
      return _.include(rolenames, role.name);
    });
    callback.call(self, match);
  }

  self.roles ? cb(self.roles) : self.getRoles(cb);
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
      err && rmsUtil.error(err);
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
      err && rmsUtil.error(err);
      callback.call(self, results);
    });
  });
};

module.exports = User;
