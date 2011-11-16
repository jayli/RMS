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

db.formatObj = function(obj, config) {
  var cfg = {
    extraKey: [],
    extraVal: [],
    split: ', '
  };
  _.extend(cfg, config);

  var k = cfg.extraKey;
  var v = cfg.extraVal;

  for (var i in obj) {
    k.push(i + '=?');
    v.push(obj[i]);
  }
  return {
    flag: k.join(cfg.split),
    value: v
  };
};

db.obj2flag = function(obj) {
  return db.formatObj(obj, {
    extraKey: ['gmt_create = ?', 'gmt_modified = ?'],
    extraVal: [new Date, new Date]
  })
};

db.lastModified = function(table, obj, callback) {
  obj = db.formatObj(obj);
  client.query(
    'UPDATE ' + table + ' SET gmt_modified=? WHERE ' + obj.flag,
    [new Date].concat(obj.value),
    callback
  );
};

db.insert = function(table, obj, callback) {
  obj = db.obj2flag(obj);
  client.query(
    'INSERT INTO ' + table + ' SET ' + obj.flag, obj.value, callback);
};

module.exports = db;
