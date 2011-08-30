// vim: set sw=2 ts=2:

var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');
var content = fs.readFileSync(
        path.join(__dirname, 'data', 'gbk.js'), 'ascii').toString();
console.log(uglify(content, {gen_options: {
    ascii_only: true
}}));

var native2ascii = require('native2ascii').native2ascii;
console.log(native2ascii(content));
