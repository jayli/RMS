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
  var self = this;

  self.config = _({
    path: '/',
    version: 1
  }).extend(config);

  self.command = spawn('svn', [
    'list',
    '--non-interactive',
    '--username',
    rmsConfig.svn.username,
    '--password',
    rmsConfig.svn.password,
    '--xml',
    '-r',
    self.config.version,
    self.config.path
  ]);

  self.command.stdout.setEncoding('utf8');
  self.command.stderr.setEncoding('utf8');

  var out = '';
  self.command.stdout.on('data', function(data) {
    out += data;
  });

  self.command.stdout.on('end', function() {
    out = JSON.parse(xml2json(out));
    self.emit('list', out.lists.list.entry);
  });

  self.command.stderr.on('data', function(data) {
    self.emit('stderr', data);
  });

  self.command.on('exit', function(code) {
    if (code != 0) console.error('svn command exit unexpectly.');
  });
};

require('util').inherits(subversion, process.EventEmitter);
