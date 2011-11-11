// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web database.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var mysql = require('mysql');
var rmsUtil = require('../rmsUtil');
var dbConfig = WebConfig.database;
var client = mysql.createClient(dbConfig);

var db = new (require('events').EventEmitter)();

db.client = client;

db.get = function(id, callback) {
  client.query('SELECT * FROM app WHERE id=' + id, callback);
};

db.getAll = function(type, callback) {
  client.query(
      'SELECT * FROM app WHERE type=' + WebConfig.apptypes[type],
      callback);
};

db.create = function(obj, callback) {
  var k = ['gmt_create = ?', 'gmt_modified = ?'],
      v = [new Date(), new Date()];

  for (var i in obj) {
    k.push(i + '= ?');
    v.push(obj[i]);
  }
  client.query('INSERT INTO app SET ' + k.join(', '), v, callback);
};

/*
db.create({
  name: 'assets',
  svnroot: 'http://svn.taobao-develop.com/repos/assets/trunk/assets',
  type: 0,
  version: 47041
}, function(results) {
  console.log(results);
});
*/

db.delete = function(id, callback) {
  client.query('DELETE FROM app WHERE id=' + id, callback);
};

/*
db.delete(10, function(results, fields) {
  console.log(results);
});
*/

module.exports = db;
