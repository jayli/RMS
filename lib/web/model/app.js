// vim: set sw=2 ts=2:

/**
 * @fileoverview 应用管理.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var db = require('../database');
var client = db.client;

var app = exports;

app.getById = function(id, callback) {
  client.query('SELECT * FROM app WHERE id=?', [id], callback);
};

app.getByName = function(name, callback) {
  client.query('SELECT * FROM app WHERE name=?', [name], callback);
};

app.getAll = function(type, callback) {
  client.query('SELECT * FROM app WHERE type=?',
      [WebConfig.apptypes[type]],
      callback);
};

app.create = function(obj, callback) {
  obj = db.obj2flag(obj);
  client.query('INSERT INTO app SET ' + obj.flag, obj.value, callback);
};

app.deleteById = function(id, callback) {
  client.query('DELETE FROM app WHERE id=?', [id], callback);
};

app.deleteByName = function(name, callback) {
  client.query('DELETE FROM app WHERE name=?', [name], callback);
};
