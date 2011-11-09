// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web Index.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var express = require('express');
var viewEngineMustache = require('./controller/mustache');

var config = require('./config');
var util = require('./util');
var _ = require('underscore');

var app = express.createServer();

global.WebConfig = config;
global.WebUtil = util;
global.App = app;
global._ = _;

app.use(express.cookieParser());
app.use(express.static(__dirname + '/view'));

app.set('views', __dirname + '/view');
app.set('view options', {layout: false});
app.register('.mustache', viewEngineMustache);
app.set('view engine', 'mustache');

app.use(require('./controller/login'));
app.use(require('./controller/layout'));

app.get('/:apptype/:id?', function(req, res) {
  var apptype = req.params.apptype;
  if (apptype in WebConfig.apps) {
    var apps = res._locals.apps;
    apps.forEach(function(app, idx) {
      if (app.href === apptype) {
        apps[idx].active = true;
      }
    });

    res.local('apptype-href', apptype);
    res.local('apptype-name', WebConfig.apps[apptype]);
    res.local('app-href', req.params.id);
    res.local('app-name', req.params.id);

    if (!req.params.id) {
      WebUtil.partial(res, 'list');
    } else {
      WebUtil.partial(res, 'detail');
    }

  } else {
    // throw out 404
  }
  res.render('index');
});

app.all('*', function(req, res) {
  res.render('error', {
    error: 'Route Not Found. ' + req.url
  });
});

app.error(function(err, req, res, next) {
  res.render('error', {
    error: err
  });
});

app.listen(WebConfig.port);
