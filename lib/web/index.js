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

var db = require('./database');

app.use(express.cookieParser());
app.use(express.static(__dirname + '/view'));
app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

app.set('views', __dirname + '/view');
app.set('view options', {layout: false});
app.register('.mustache', viewEngineMustache);
app.set('view engine', 'mustache');

app.use(require('./controller/login'));
app.use(require('./controller/layout'));

app.get('/:apptype/:id?', function(req, res) {
  var apptype = req.params.apptype;
  var id = req.params.id;

  if (apptype in WebConfig.apps) {
    var apps = res._locals.apps;
    apps.forEach(function(app, idx) {
      if (app.href === apptype) {
        apps[idx].active = true;
      }
    });

    res.local('apptype-href', apptype);
    res.local('apptype-name', WebConfig.apps[apptype]);

    res.local('app-href', id);
    res.local('app-name', id);

    if (!id) {
      WebUtil.partial(res, 'list');
      db.getAll(apptype, function(results, fields) {
        var list = [];
        results.forEach(function(result) {
          list.push({
            'app-name': result.name,
            'app-version': result.version,
            'app-svnroot': result.svnroot
          });
        });
        res.local('list', list);
        res.render('index');
      });
    } else {
      if (id === 'new') {
        res.local('newapp', true);
        var apptypes = [];
        for (var i in WebConfig.apps) {
          apptypes.push({
            value: WebConfig.apptypes[i],
            name: WebConfig.apps[i],
            active: apptype === i
          });
        }
        res.local('apptypes', apptypes);
        WebUtil.partial(res, 'newapp');
      } else {
        WebUtil.partial(res, 'detail');
      }
      res.render('index');
    }
  } else {
    res.local('error', 'App Not Found. ' + apptype);
    res.render('error');
  }
});

app.all('*', function(req, res) {
  res.local('error', 'Route Not Found. ' + req.url);
  res.render('error');
});

app.error(function(err, req, res, next) {
  res.local('error', err.message);
  res.render('error');
});

app.listen(WebConfig.port);
