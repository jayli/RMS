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
var path = require('path');
var _ = require('underscore');

var svnquery = require('../svn/query');

var app = express.createServer();

global.RmsConfig = rmsConfig;
global.WebConfig = config;
global.WebUtil = util;
global.App = app;
global._ = _;

var appModel = require('./model/app');

app.use(express.cookieParser());
app.use(express.static(__dirname + '/view'));
app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

app.set('views', __dirname + '/view');
app.set('view options', {layout: false});
app.set('view cache', true);
app.register('.mustache', viewEngineMustache);
app.set('view engine', 'mustache');

app.use(require('./controller/login'));
app.use(require('./controller/layout'));

app.get('/:apptype/:id?/:action?/*?', function(req, res) {
  var slash = req.url.match(/\//g).length;

  // TODO 路由规则需要仔细设计
  if (req.params[0]) {
    ['id', 'action'].some(function(k, i) {
      if (slash <= i + 2) {
        req.params[k] = req.params.shift();
        return false;
      }
    });
    req.params.path = req.params.shift();
  }
  console.log(req.params);

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
      appModel.getAll(apptype, function(err, results, fields) {
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

          // 给根目录补全最后一个斜杠
          // 避免读svn的时候有一次301
          if (!/\/$/.test(req.query.svnroot))
            req.query.svnroot += '/';

          svnquery(req.query.svnroot, rmsConfig.svn, function(err, o) {
            if (err) {
              res.local('message', {
                type: 'error',
                text: err.message
              });
              newapp();
              res.render('index');
              return;
            }

            appModel.create({
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
          appModel.delete(id, function(err, results, fileds) {
            if (err) {
              res.local('message', {
                type: 'error',
                text: err.message
              });
            }
            res.redirect('/' + apptype);
          });
        } else {

          // 获取单个应用列表
          appModel.get(id, function(err, results, fields) {
            var result = results[0];
            res.local('app-name', result.name);
            if (action === 'show') {
              result.svnroot += req.params.path;
            }
            svnquery(result.svnroot, rmsConfig.svn, function(err, o) {
              if (err) {
                res.local('message', {
                  type: 'error',
                  text: err.message
                });
                WebUtil.partial(res, 'detail');
                res.render('index');
                return;
              }

              var filename = '';
              if (req.params.path) {
                var ps = req.params.path.split(/\//g);
                filename = ps.pop();
                res.local('app-filename', filename);

                var pathes = [];
                ps.forEach(function(path, i) {
                  pathes[i] = {
                    href: ps.slice(0, i + 1).join('/'),
                    name: path
                  };
                });

                res.local('pathes', pathes);
                res.local('prefix', req.params.path);
              }
              res.local('svn', o);

              if (typeof o !== 'object') {
                var ext = path.extname(filename);
                res.local('app-fileextend', ext);
                if (/\.(txt|js|css|xml|html|php)/.test(ext)) {
                  res.local('txt', true);
                }

                res.local('app-file', true);
                WebUtil.partial(res, 'file');
              }

              WebUtil.partial(res, 'detail');
              res.render('index');
            });
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
