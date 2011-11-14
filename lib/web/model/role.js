// vim: set sw=2 ts=2:

/**
 * @fileoverview 角色管理.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var client = db.client;

var role = exports;

role.addRole = function(obj, callback) {
  db.insert('role', obj, callback);
};

role.getRolesByUsername = function(name, callback) {
  client.query(
    'SELECT * FROM role WHERE id=ANY(SELECT role_id FROM user_role' +
      ' WHERE user_id=(SELECT id FROM user WHERE name=?))',
    [name], callback);
};

role.getUsersByRolename = function(name, callback) {
  client.query(
    'SELECT * FROM user WHERE id=ANY(SELECT user_id FROM user_role' +
      ' WHERE role_id=(SELECT id FROM role WHERE name=?))',
    [name], callback);
};
