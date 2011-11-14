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

db.obj2flag = function(obj) {
  var k = ['gmt_create = ?', 'gmt_modified = ?'],
      v = [new Date(), new Date()];

  for (var i in obj) {
    k.push(i + '= ?');
    v.push(obj[i]);
  }
  return {
    flag: k.join(', '),
    value: v
  };
};

db.updateTime = function(table, conditions, callback) {
  client.query(
    'UPDATE ' + table + ' SET gmt_modified=? WHERE ?',
    [new Date, conditions],
    callback
  );
};

db.insert = function(table, obj, callback) {
  obj = db.obj2flag(obj);
  client.query(
    'INSERT INTO ' + table + ' SET ' + obj.flag, obj.value, callback);
};

module.exports = db;
