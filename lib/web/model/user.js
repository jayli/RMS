// vim: set sw=2 ts=2:

/**
 * @fileoverview 用户管理.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var client = db.client;

var user = exports;

user.getGroupsByUsername = function(name, callback) {
  client.query(
    'SELECT * FROM role WHERE id=(SELECT role_id FROM user_role' +
      ' WHERE user_id=(SELECT id FROM user WHERE name=?))',
    [name], callback);
};

user.create = function(obj, callback) {
  db.insert('user', obj, callback);
};

user.updateTime = function(username, callback) {
  db.updateTime('user', {
    name: username
  }, callback);
};

user.exists = function(username, callback) {
  client.query(
    'SELECT * FROM user WHERE name=?',
    [username],
    function(err, results, fields) {
      callback(results.length !== 0);
    });
};
