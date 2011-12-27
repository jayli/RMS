// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web database.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var mysql = require('mysql');
var _ = require('underscore');
var dbConfig = require('./config').database;
var client = mysql.createClient(dbConfig);

var db = exports;

db.client = client;

db.formatObj = function(obj) {
  var k = [], v = [];

  for (var i in obj) {
    k.push(i + '=?');
    v.push(obj[i]);
  }

  return {
    flag: k.join(',')
  , value: v
  };
};

db.formatInsertObj = function(obj, extra) {
  var k = [], v = [],  s = [];

  obj = _.extend(obj, extra);

  for (var i in obj) {
    s.push('?');
    k.push(i);
    v.push(obj[i]);
  }

  return {
    flag: ' (' + k.join(',') + ') VALUES (' + s.join(',') + ') '
  , value: v
  };
};

db.obj2flag = function(obj) {
  return db.formatInsertObj(obj, {
    gmt_create: new Date
  , gmt_modified: new Date
  });
};

db.lastModified = function(table, obj, callback) {
  obj = db.formatObj(obj);
  client.query(
    'UPDATE ' + table + ' SET gmt_modified=? WHERE ' + obj.flag,
    [new Date].concat(obj.value),
    callback
  );
};

db.select = function(table, field, conditions, extra, callback) {
  if (typeof extra === 'function') {
    callback = extra;
    extra = '';
  }
  conditions = db.formatObj(conditions);
  client.query(
    'SELECT ' + field + ' FROM ' + table +
    ' WHERE ' + conditions.flag + ' ' + extra,
    conditions.value, callback);
};

db.insert = function(table, obj, callback) {
  obj = db.obj2flag(obj);
  client.query('INSERT INTO ' + table + obj.flag,
    obj.value, callback);
};

db.update = function(table, conditions, obj, callback) {
  obj = db.formatObj(_(obj).extend({
    gmt_modified: new Date
  }));
  conditions = db.formatObj(conditions);
  client.query('UPDATE ' + table + ' SET ' + obj.flag +
    ' WHERE ' + conditions.flag, obj.value.concat(conditions.value), callback);
};
