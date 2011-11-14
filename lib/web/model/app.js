// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web assets models.
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
  client.query(
      'SELECT * FROM app WHERE type=?',
      [WebConfig.apptypes[type]],
      callback);
};

app.create = function(obj, callback) {
  var k = ['gmt_create = ?', 'gmt_modified = ?'],
      v = [new Date(), new Date()];

  for (var i in obj) {
    k.push(i + '= ?');
    v.push(obj[i]);
  }
  // TODO 用format来实现更安全
  client.query('INSERT INTO app SET ' + k.join(', '), v, callback);
};

app.deleteById = function(id, callback) {
  client.query('DELETE FROM app WHERE id=?', [id], callback);
};

app.deleteByName = function(name, callback) {
  client.query('DELETE FROM app WHERE name=?', [name], callback);
};
