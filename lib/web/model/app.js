// vim: set sw=2 ts=2:

/**
 * @fileoverview 应用管理.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var client = db.client;

var App = function(obj) {
  _.defaults(this, obj);
};

App.prototype.update = function(callback) {
  var self = this;
  client.query('SELECT * FROM app WHERE name=?',
    [self.name], function(err, results, fields) {
      err && console.error(error);
      if (results[0]) {
        self.id = results[0].id;
        self.svnroot = results[0].svnroot;
        self.version = results[0].version;
        self.type = results[0].type;
      }
      callback.call(self);
    });
};

App.prototype.create = function(callback) {
  client.query('SELECT id FROM app WHERE name=?',
    [self.name], function(err, results, fields) {
      err && console.error(err);
      if (results.length === 0) {
        var obj = db.obj2flag(self);
        client.query('INSERT INTO app SET ' + obj.flag,
          obj.value, function(err, results, fields) {
            err && console.error(err);
            callback.call(self, true);
          });
      } else {
        callback.call(self, false, 'app exist.');
      }
    });
};

App.prototype.del = function(callback) {
  client.query('DELETE FROM app WHERE name=?',
    [self.name], function(err, results, fields) {
      err && console.error(err);
      callback.call(self, results);
    });
};

App.prototype.getRoles = function(callback) {
  var self = this;
  client.query(
    'SELECT * FROM role WHERE id=ANY(' +
    'SELECT role_id FROM role_permission WHERE action_id=3 AND target_id=?)',
    [self.id], function(err, results, fields) {
      err && console.error(err);
      callback.call(self, results);
    });
};

App.prototype.addRole = function(id, callback) {
  var self = this;
  var Role = Model('role')
  new Role({id: id}).exist(function(exist, results) {
    if (!exist) {
      return callback.call(self, new Error(
          'role ' + id + ' does not exist.'));
    }
    var obj = {
      role_id: id,
      action_id: 3,
      target_id: self.id
    };
    var sObj = db.formatObj(obj);
    client.query('SELECT * FROM role_permission WHERE ' + sObj.flag,
      sObj.value, function(err, results, fields) {
        // console.log(results);
        if (results && results.length !== 0) {
          console.log('permission exist');
          return callback(self);
        }
        obj = db.obj2flag(obj);
        client.query('INSERT INTO role_permission SET ' + obj.flag,
          obj.value, function(err, results, fields) {
            err && console.error(err);
            callback.call(self);
          });
      });
  });
};

App.prototype.removeRole = function(id, callback) {
  var self = this;
  var Role = Model('role');
  new Role({id: id}).exist(function(exist, results) {
    if (!exist) {
      return callback.call(self, new Error(
          'role ' + id + ' does not exist.'));
    }
    var obj = db.formatObj({
      role_id: +id,
      action_id: 3,
      target_id: self.id
    }, {
      split: ' AND '
    });
    client.query('DELETE FROM role_permission WHERE ' + obj.flag,
      obj.value, function(err, results, fields) {
        err && console.error(err);
        callback.call(self);
      });
  });
};

module.exports = App;
