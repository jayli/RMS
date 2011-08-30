// vim: set sw=2 ts=2:

var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');
var content = fs.readFileSync(
        path.join(__dirname, 'data', 'gbk.js'));
var iconv = require('iconv').Iconv;
var gbk2utf8 = new iconv('GBK', 'UTF-8');

var utf8 = new iconv('UTF-8', 'UTF-8');
try {
    console.log(utf8.convert(content));
} catch (e) {
    if (e.code == 'EILSEQ')
    console.log(e);
}

content = gbk2utf8.convert(content);
console.log(uglify(content.toString(), {gen_options: {
    ascii_only: true
}}));

var native2ascii = require('native2ascii').native2ascii;
console.log(native2ascii(content.toString()));
