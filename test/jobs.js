// vim: set sw=2 ts=2:

var vows = require('vows');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var batches = {};
var files = fs.readdirSync('./test/jobs/');
files.forEach(function(job) {
  if (!/\.js$/.test(job)) return;
  job = require(fs.realpathSync('./test/jobs/' + job));
  batches = _.extend(batches, job.suite);
});

vows.describe('jobs').addBatch(batches).export(module, {error: false});
