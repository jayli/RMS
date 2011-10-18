// vim: set sw=2 ts=2:

var assert = require('assert');
var syntaxChecker = require('../lib/jobs/syntaxChecker');

var str = 'var yourname = 1;';
var sc = new syntaxChecker({type: 'JavaScript'});
sc.run(str, function(content) {
  assert.equal(str, content);
});

var str = 'var yourname =;';
var sc = new syntaxChecker({type: 'JavaScript'});
sc.run(str, function(content) {
  assert.notEqual(str, content);
});
