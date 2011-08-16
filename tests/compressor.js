// vim: set sw=2 ts=2:

var fs = require('fs');
var path = require('path');
var http = require('http');
var querystring = require('querystring');
var util = require('util');

var content = path.join(__dirname, 'data', 'kissy.js');
content = fs.readFileSync(content).toString();

var postData = querystring.stringify({
  content: content,
  config: JSON.stringify({
    type: 'JavaScript',
    steps: [['compressor', {}]]
  })
});

var opts = {
  host: 'trade.ued.taobao.net',
  port: 8080,
  path: '/precompile',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': postData.length
  }
};

var postReq = http.request(opts, function(res) {
  res.setEncoding('utf8');
  var code = '';
  res.on('data', function(chunk) {
    code += chunk.toString();
  });
  res.on('end', function(chunk) {
    console.log(code);
  });
});

postReq.write(postData);
postReq.end();
