// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web Index.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var express = require('express');

var rmsConfig = require('../rmsConfig');
var rmsUtil = require('../rmsUtil');

var config = require('./config');
var util = require('./util');
var _ = require('underscore');

var svnquery = require('../svn/query');

var app = express.createServer();

global.RmsConfig = rmsConfig;
global.RmsUtil = rmsUtil;
global.WebConfig = config;
global.WebUtil = util;
global.App = app;
global._ = _;
global.svnquery = svnquery;

app.use(express.cookieParser());
app.use(express.static(__dirname + '/view'));
app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

app.set('views', __dirname + '/view/template');
app.set('view options', {layout: false});
// app.set('view cache', true);
app.register('.mustache', require('./view/mustache'));
app.set('view engine', 'mustache');

app.use(require('./controller/login'));
app.use(require('./view/layout'));

require('./controller/apps/new');
require('./controller/apps/list');
require('./controller/apps/index');
require('./controller/apps/admin');

app.all('*', function(req, res) {
  res.local('error', 'Route Not Found. ' + req.url);
  res.render('error');
});

app.error(function(err, req, res, next) {
  res.local('error', err.message);
  res.render('error');
});

app.listen(WebConfig.port);
