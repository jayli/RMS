// vim: set sw=2 ts=2:

/**
 * @fileoverview 用户管理.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var client = db.client;

var user = exports;

user.create = function(username, callback) {
  db.insert('user', {name: username}, callback);
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
