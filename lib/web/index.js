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

  // 登录验证
  App.use(require('./controller/role/login'));
  // 统一布局
  App.use(require('./view/layout'));
});

App.configure('development', function() {
  App.use(express.errorHandler({dumpExceptions: true, showStack: true}));
  App.listen(WebConfig.devPort);
});

App.configure('production', function() {
  App.use(express.errorHandler());
  App.listen(WebConfig.port);
});
// }}}

// 路由 {{{
// 首页
require('./controller/index');

// 权限管理
require('./controller/role/show');

// 应用管理
require('./controller/apps/new');
require('./controller/apps/admin');
require('./controller/apps/list');
require('./controller/apps/index');
require('./controller/apps/detail');

// 全局错误拦截
require('./controller/error');
// }}}
