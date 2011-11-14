// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var express = require('express');
var app = express.createServer();

var _ = require('underscore');
var rmsConfig = require('../rmsConfig');
var rmsUtil = require('../rmsUtil');
var config = require('./config');
var util = require('./util');
var svnquery = require('../service/svn/query');

global.RmsConfig = rmsConfig;
global.RmsUtil = rmsUtil;
global.WebConfig = config;
global.WebUtil = util;
global.App = app;
global._ = _;
global.svnquery = svnquery;

// 全局配置 {{{
// app.set('view cache', true);
app.set('views', __dirname + '/view/template');
app.set('view options', {layout: false});
app.register('.mustache', require('./view/mustache'));
app.set('view engine', 'mustache');
// }}}

app.use(express.cookieParser());
app.use(express.static(__dirname + '/view'));
app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

// 全局模块 {{{
// 登录验证
app.use(require('./controller/login'));
// 统一布局
app.use(require('./view/layout'));
// }}}

// 路由 {{{
// 权限管理
require('./controller/role/show');

// 应用管理
require('./controller/apps/new');
require('./controller/apps/admin');
require('./controller/apps/list');
require('./controller/apps/index');
require('./controller/apps/show');

// 全局错误拦截
app.all('*', function(req, res) {
  res.local('error', 'Route Not Found. ' + req.url);
  res.render('error');
});

app.error(function(err, req, res, next) {
  res.local('error', err.message);
  res.render('error');
});
// }}}

app.listen(WebConfig.port);
