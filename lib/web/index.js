// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var express = require('express');

// 全局变量 {{{
global._ = require('underscore');
global.App = express.createServer();
global.RmsConfig = require('../rmsConfig');
global.RmsUtil = require('../rmsUtil');
global.WebConfig = require('./config');
global.WebUtil = require('./util');
global.svnquery = require('../service/svn/query');
global.Controller = WebUtil.controller;
global.Model = WebUtil.model;
// }}}

// 全局配置 {{{
App.configure(function() {
  App.register('.mustache', require('./view/mustache'));
  // App.set('view cache', true);
  App.set('view engine', 'mustache');
  App.set('view options', {layout: false});
  App.set('views', __dirname + '/view/template');

  App.use(express.cookieParser());
  App.use(express.static(__dirname + '/view'));

  App.use(express.bodyParser());

  // 登录验证
  App.use(require('./controller/role/login'));
  // 统一布局
  App.use(require('./view/layout'));
});

App.configure('development', function() {
  App.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

App.configure('production', function() {
  App.use(express.errorHandler());
});
// }}}

// 路由 {{{
// 裸模版
require('./view/raw');

Controller('test');

// 首页
Controller('index');

// 权限管理
Controller('role/show');

// 应用管理
Controller('apps/new');
Controller('apps/admin');
Controller('apps/list');
Controller('apps/index');
Controller('apps/detail');

// 全局错误拦截
Controller('error');
// }}}

App.listen(WebConfig.port);
