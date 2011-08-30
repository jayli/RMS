// vim: set sw=2 ts=2:

var fs = require('fs');
var path = require('path');
var http = require('http');
var querystring = require('querystring');
var native2ascii = require('native2ascii').native2ascii;
var util = require('util');

var time = +new Date;
var counter = 0;
var repeat = +process.argv[2] || 5;
var first = true;

function run(content, type, steps) {
  var postData = querystring.stringify({
    content: native2ascii(content),
    config: JSON.stringify({
      type: type,
      steps: steps || [['compressor', {}]]
    })
  });

  var opts = {
    host: '127.0.0.1',
    port: 8088,
    path: '/precompile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var eachTime = +new Date;
  var postReq = http.request(opts, function(res) {
    res.setEncoding('utf8');
    var code = '';
    res.on('data', function(chunk) {
      code += chunk.toString();
    }).on('end', function(chunk) {
      if (first) {
        console.log('First Response: %s ms', +new Date - eachTime);
        first = false;
      }
      console.log('Success: %s, %s ms',
          JSON.parse(code).success, +new Date - eachTime);
      if (++counter == repeat) {
        console.log('All Done, Total Time %s ms', +new Date - time);
      }
    });
  });

  postReq.write(postData);
  postReq.end();
}


function read(name) {
  var content = path.join(__dirname, 'data', name);
  return fs.readFileSync(content).toString();
}

//run(read('yui.js'), 'JavaScript');
//run(read('kissy-min.js'), 'JavaScript');
//run(read('search.css'), 'CSS');
//run(read('search.source.css'), 'CSS', i);
//run(read('kissy.js'), 'JavaScript');

var content = read('kissy.js');
time = +new Date;

// empty steps
// api performance
/*
for (var i = 0, l = repeat; i < l; i++) {
  run(content, 'JavaScript', []);
}
*/

// compress job
/*
for (var i = 0, l = repeat; i < l; i++) {
  run(content, 'JavaScript');
}
*/

// syntaxCheck job
/*
for (var i = 0, l = repeat; i < l; i++) {
  run(content, 'JavaScript', [['syntaxChecker', {}]]);
}
*/

// nativeascii job
/*
for (var i = 0, l = repeat; i < l; i++) {
  run(content, 'JavaScript', [['nativeascii', {}]]);
}
*/

// encode problem
/*
content = native2ascii(read('search.source.css'));
for (var i = 0, l = repeat; i < l; i++) {
  run(content, 'CSS', [['nativeascii', {}]]);
}
*/

// combination with css
/*
content = native2ascii(read('search.source.css'));
for (var i = 0, l = repeat; i < l; i++) {
  run(content, 'CSS', [
      ['nativeascii', {}],
      ['compressor', {}]
  ]);
}

// combination with js
content = native2ascii(read('kissy.js'));
for (var i = 0, l = repeat; i < l; i++) {
  run(content, 'JavaScript', [
      ['nativeascii', {}],
      ['compressor', {}]
  ]);
}
*/
