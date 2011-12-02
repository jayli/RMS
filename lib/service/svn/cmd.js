// vim: set sw=2 ts=2:

/**
 * @fileoverview port for svn command.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var _ = require('underscore');
var spawn = require('child_process').spawn;
var xml2json = require('xml2json').toJson;
var rmsConfig = require('../../rmsConfig');

var subversion = module.exports = function(config) {
  process.EventEmitter.call(this);
  this.config = _({
    path: '/',
    version: 1
  }).extend(config);

  this.command = spawn('svn', [
    'list',
    '--non-interactive',
    '--username',
    rmsConfig.svn.username,
    '--password',
    rmsConfig.svn.password,
    '--xml',
    '-r',
    this.config.version,
    this.config.path
  ]);

  var self = this;

  this.command.stdout.setEncoding('utf8');
  this.command.stderr.setEncoding('utf8');

  var out = '';
  this.command.stdout.on('data', function(data) {
    out += data;
  });

  this.command.stdout.on('end', function() {
    out = JSON.parse(xml2json(out));
    self.emit('list', out.lists.list.entry);
  });

  this.command.stderr.on('data', function(data) {
    self.emit('stderr', data);
  });

  this.command.on('exit', function(code) {
    // console.log(code);
  });
};

require('util').inherits(subversion, process.EventEmitter);
