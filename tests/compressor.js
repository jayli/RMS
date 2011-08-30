// vim: set sw=2 ts=2:

var fs = require('fs');
var path = require('path');
var file = process.argv[2];
var type = /\.js$/.test(file) ? 'JavaScript' : 'CSS';
var compressor = new (require('../lib/jobs/compressor.js'))({
    type: type
});
var src = fs.readFileSync(path.join(__dirname, '..', file)).toString();
var t = +new Date;
compressor.run(src, function(content) {
  console.log('take %s ms.', +new Date - t);
  fs.writeFileSync('/tmp/kissy-multi-min.js', content);
});
