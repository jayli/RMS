// vim: set sw=2 ts=2:

var assert = require('assert');
var APIeasy = require('api-easy');
var fs = require('fs');
var path = require('path');

var file = process.argv[2];
if (!file) {
  console.log('Usage: node test/file.js yorufile.js');
}

var suite = APIeasy.describe('API Test');

suite.use('localhost', 8088)
  .setHeader('Content-Type', 'application/json; charset=GBK');

suite.next().post('/precompile', {
    content: fs.readFileSync(fs.realpathSync(file)).toString(),
      config: JSON.stringify({
      type: 'JavaScript',
      steps: [
        ['nativeascii', {}],
        ['compressor', {}]
      ]
    })
  })
  .expect(200)
  .expect('normal file',
    function(err, res, body) {
      body = JSON.parse(body);
      assert.ok(body.success);
    })
  .export(module);
