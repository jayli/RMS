// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web Index.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var express = require('express');
var viewEngineMustache = require('./controller/mustache');

var config = require('./config');
var _ = require('underscore');

var app = express.createServer();

global.WebConfig = config;
global.App = app;
global._ = _;

app.use(express.static(__dirname + '/view'));
app.use(express.cookieParser());

app.set('views', __dirname + '/view');
app.set('view options', {layout: false});
app.register('.mustache', viewEngineMustache);
app.set('view engine', 'mustache');

app.use(require('./controller/login'));
app.use(require('./controller/topbar'));

app.get('/:apptype/:id?', function(req, res) {
  if (req.params.apptype in WebConfig.apps) {
    res.local('');
  }
  res.render('index');
});

app.get('/assets/:id', function(req, res) {
});

app.listen(7887);
