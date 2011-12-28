// vim: set sw=2 ts=2:

/**
 * @fileoverview 应用管理.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var client = db.client;

var App = function(obj) {
  _(this).defaults(obj);
};

App.prototype.update = function(callback) {
  var self = this;
  client.query('SELECT * FROM app WHERE name=?',
    [self.name], function(err, results, fields) {
      err && rmsUtil.error(error);
      if (results[0]) {
        self.id = results[0].id;
        self.svnroot = results[0].svnroot;
        self.type = results[0].type;
      }
      callback.call(self);
    });
};

App.prototype.create = function(callback) {
  var self = this;
  client.query('SELECT id FROM app WHERE name=?',
    [self.name], function(err, results, fields) {
      err && rmsUtil.error(err);
      if (results.length === 0) {
        db.insert('app', {
          svnroot: self.svnroot
        , name: self.name
        , type: self.type
        }, function(err, results, fields) {
          err && rmsUtil.error(err);
          callback(err);
        });
      } else {
        callback(new Error('app exist.'));
      }
    });
};

App.prototype.del = function(callback) {
  var self = this;
  client.query('DELETE FROM app WHERE name=?',
    [self.name], function(err, results, fields) {
      err && rmsUtil.error(err);
      callback(results);
    });
};

App.prototype.getRoles = function(callback) {
  var self = this;
  client.query(
    'SELECT role_id FROM role_permission WHERE action_id=3 AND app_id=?',
    [self.id], function(err, results) {
      err && rmsUtil.error(err);
      if (results.length === 0) return callback(err, results);
      var o = _(results).map(function(item) {
        return item.role_id;
      });
      client.query('SELECT * FROM role WHERE id IN (' + o.join(',') + ')',
        function(err, results) {
          err && rmsUtil.error(err);
          callback(results);
        });
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
      app_id: self.id
    };
    var sObj = db.formatObj(obj);
    client.query('SELECT * FROM role_permission WHERE ' + sObj.flag,
      sObj.value, function(err, results, fields) {
        // rmsUtil.log(results);
        if (results && results.length !== 0) {
          rmsUtil.log('permission exist');
          return callback(self);
        }
        db.insert('role_permission ', obj, function(err, results, fields) {
          err && rmsUtil.error(err);
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
      return callback.call(self, new Error('role ' + id + ' does not exist.'));
    }
    var obj = db.formatObj({
      role_id: +id,
      action_id: 3,
      app_id: self.id
    }, {
      split: ' AND '
    });
    client.query('DELETE FROM role_permission WHERE ' + obj.flag,
      obj.value, function(err, results, fields) {
        err && rmsUtil.error(err);
        callback.call(self);
      });
  });
};

module.exports = App;
