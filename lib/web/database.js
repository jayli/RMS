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

module.exports = db;
