// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web database.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var mysql = require('mysql');
var dbConfig = WebConfig.database;
var client = mysql.createClient(dbConfig);

/*
client.query('INSERT INTO app SET name = ?, svnroot = ?, version = ?, gmt_create = ?, gmt_modified = ?', [
  'tms', 'http://svn.taobao-develop.com/repos/tms/trunk/tms/assets', 2735, new Date, new Date
]);
*/

module.exports = new require('events').EventEmitter();
var db = module.exports;

db.client = client;

db.getAll = function(table, callback) {
  client.query('SELECT * FROM ' + table, function(err, results, fields) {
    if (err) db.emit(table + '-error', err);
    callback(results, fields);
    //client.end();
  });
};
