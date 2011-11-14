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
