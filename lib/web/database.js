// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web database.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var async = require('async');
var mysql = require('mysql');
var _ = require('underscore');
var dbConfig = require('./config').database;
var client = mysql.createClient(dbConfig);

var db = exports;

db.client = client;

db.formatObj = function(obj, config) {
  var k = [], v = [], cfg = _({split: ','}).extend(config);

  for (var i in obj) {
    if (_(obj[i]).isArray()) {
      _(obj[i]).map(function(item) {
        return client.format('?', [item]);
      });
      k.push(i + ' IN (' + obj[i].join(',') + ')');
    } else {
      k.push(i + '=?');
      v.push(obj[i]);
    }
  }

  return {
    flag: k.join(' ' + cfg.split + ' ')
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
  conditions = db.formatObj(conditions, {split: 'AND'});
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

// 代替ANY
db.joinSelect = function(arr, callback) {
  async.waterfall(_(arr).map(function(item, idx) {

    var table = item[0];
    var target = item[1];
    var nextKey = item[2];
    var conditions = item[3] || {};

    return function(ids, next) {

      // first one
      if (_(ids).isFunction()) {
        next = ids;
      } else {
        conditions[nextKey] = ids;
      }

      db.select(table, target, conditions, function(err, results) {
        err && rmsUtil.error(err);

        // last one
        if (idx === arr.length - 1) return callback(results);

        if (results.length === 0) return callback(results);
        next(err, _(results).map(function(item) {
          return item[target];
        }));

      });

    };
  }));
};
