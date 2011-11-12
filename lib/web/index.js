// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web Index.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var express = require('express');
var viewEngineMustache = require('./controller/mustache');

var rmsConfig = require('../rmsConfig');
var config = require('./config');
var util = require('./util');
var _ = require('underscore');

var svnquery = require('../svn/query');

var app = express.createServer();

global.RmsConfig = rmsConfig;
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

app.get('/:apptype/:id?/:action?', function(req, res) {
  var apptype = req.params.apptype;
  var id = req.params.id;
  var action = req.params.action;

  if (apptype in WebConfig.apps) {
    var apps = res._locals.apps;
    apps.forEach(function(app, idx) {
      if (app.href === apptype) {
        apps[idx].active = true;
      }
    });

    res.local('apptype-href', apptype);
    res.local('apptype-name', WebConfig.apps[apptype]);

    res.local('app-id', id);

    if (!id) {
      WebUtil.partial(res, 'list');
      db.getAll(apptype, function(err, results, fields) {
        var list = [];
        results.forEach(function(result) {
          list.push({
            'app-id': result.id,
            'app-name': result.name,
            'app-version': result.version,
            'app-svnroot': result.svnroot
          });
        });
        res.local('list', list);
        res.render('index');
      });
    } else {

      // create a new instance
      if (id === 'new') {

        function newapp() {
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
        }

        if (req.query.apptype &&
            req.query.appname &&
            req.query.svnroot) {
          svnquery(req.query.svnroot + '/', rmsConfig.svn, function(err, o) {
            if (err) {
              res.local('message', {
                type: 'error',
                text: err.message
              });
              newapp();
              res.render('index');
              return;
            }

            db.create({
              name: req.query.appname,
              svnroot: req.query.svnroot,
              type: req.query.apptype,
              version: +o.rev
            }, function(err, results, fields) {
              if (err) {
                res.local('message', {
                  type: 'error',
                  text: err.message
                });
              } else {
                res.local('message', {
                  type: 'success',
                  text: '应用创建成功！'
                });
              }
              newapp();
              res.render('index');
            });
          });
        } else {
          newapp();
          res.render('index');
        }

      } else {
        if (action === 'delete') {
          db.delete(id, function(err, results, fileds) {
            if (err) {
              res.local('message', {
                type: 'error',
                text: err.message
              });
            }
            res.redirect('/' + apptype);
          });
        } else {
          db.get(id, function(err, results, fields) {
            res.local('app-name', results[0].name);
            WebUtil.partial(res, 'detail');
            res.render('index');
          });
        }
      }
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
