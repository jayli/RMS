// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web Index.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var fs = require('fs');
var express = require('express');
var viewEngineMustache = require('./controller/mustache');

var app = express.createServer();

app.use(express.static(__dirname + '/view'));

app.set('views', __dirname + '/view');
app.set('view options', {layout: false});
app.register('.mustache', viewEngineMustache);
app.set('view engine', 'mustache');

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(7887);
