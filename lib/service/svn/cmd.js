// vim: set sw=2 ts=2:

/**
 * @fileoverview port for svn command.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var _ = require('underscore');
var spawn = require('child_process').spawn;
var xml2json = require('xml2json').toJson;
var rmsConfig = require('../../rmsConfig');
var rmsUtil = require('../../rmsUtil');

var subversion = module.exports = function(config) {
  var self = this;

  self.config = _({
    path: '/'
  , version: 1
  , extra: []
  }).extend(config);

  if (config.recursive) {
    self.config.extra.push('-R');
  }

  self.command = spawn('svn', [
    'list'
  , '--non-interactive'
  , '--username'
  , rmsConfig.svn.username
  , '--password'
  , rmsConfig.svn.password
  , '--xml'
  , '-r'
  , self.config.version
  , self.config.path
  ].concat(self.config.extra || []));

  self.command.stdout.setEncoding('utf8');
  self.command.stderr.setEncoding('utf8');

  var out = '';
  self.command.stdout.on('data', function(data) {
    out += data;
  });

  self.command.stdout.on('end', function() {
    out = JSON.parse(xml2json(out));
    var entry = out.lists.list.entry;
    if (!_(entry).isArray()) entry = [entry];
    var list = [];
    if (self.config.recursive) {
      _(entry).each(function(item) {
        if (item.kind !== 'dir')
          list.push(item);
      });
    } else {
      list = entry;
    }
    self.emit('list', list);
  });

  self.command.stderr.on('data', function(data) {
    rmsUtil.error(data)
    self.emit('stderr', data);
  });

  self.command.on('exit', function(code) {
    if (code != 0)
      rmsUtil.error('svn command exit unexpectly. %s@%s, %s',
        self.config.path, self.config.version);
  });
};

require('util').inherits(subversion, process.EventEmitter);
