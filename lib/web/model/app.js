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

module.exports = App;
