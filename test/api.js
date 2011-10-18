// vim: set sw=2 ts=2:

var assert = require('assert');
var APIeasy = require('api-easy');

// start rms at 8088
require('../lib/rms');

var suite = APIeasy.describe('API Test');

suite.use('localhost', 8088)
  .setHeader('Content-Type', 'application/json');

suite.next().post('/precompile', {
    content: '#id{color: #ffffff}',
    config: JSON.stringify({
      type: 'CSS',
      steps: [
        ['compressor', {}]
      ]
    })
  })
  .expect(200)
  .expect('should compress css', function(err, res, body) {
    body = JSON.parse(body);
    assert.ok(body.success);
  });

suite.next().post('/precompile', {
    content: '(function(kissy) {})(KISSY)',
    config: JSON.stringify({
      type: 'JavaScript',
      steps: [
        ['compressor', {}]
      ]
    })
  })
  .expect(200)
  .expect('should compress javascript', function(err, res, body) {
    body = JSON.parse(body);
    assert.ok(body.success);
    assert.equal('(function(a){})(KISSY)', body.result);
  });

suite.export(module);
