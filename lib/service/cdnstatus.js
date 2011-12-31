// vim: set sw=2 ts=2:

/**
 * @fileoverview cdn status.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var http = require('http');
var url = require('url');
var querystring = require('querystring');

//var check_rs_uri = url.parse('http://cdnportal.corp.taobao.com:9999/cgi-bin/check_rs_url');
var check_rs_uri = url.parse('http://wiki.ued.taobao.net/check_rs_uri');

var types = {
  prepub: '110.75.14.33'
, beta: '110.75.14.78'
, cn1: 'cn1'
, all: 'all'
};

var check = module.exports = function(type, uri, cb) {
  if (!(type in types)) {
    return cb(new Error('pubtype unsupported, it should be one of these: ' +
      Object.keys(types).join(',')));
  }
  try {
    uri = url.parse(uri);
    uri = uri.protocol + '//' + uri.host + uri.pathname;
    querystring.stringify({
      station: types[type]
    , url: uri
    });
    check_rs_uri.path = check_rs_uri.pathname + '?station=' + types[type] + '&url=' + uri;
    http.get(check_rs_uri, function(res) {
      if (res.statusCode === 200) {
        var o = '';
        res.on('data', function(chunk) {
          o += chunk;
        }).on('end', function() {
          cb(null, parseResult(o));
        });
      } else {
        return cb(new Error('HTTP Error: ' + res.statusCode));
      }
    });
  } catch (e) {
    return cb(e);
  }
};

// for only one result
function parseResult(o) {
  var result = {};
  o = o.split('\n');
  o = o.slice(3, o.length - 3);
  o.forEach(function(i) {
    i = i.trim().split('\t');
    result[i[0]] = {
      ip: i[1]
    , time: new Date(i[2].replace(/(\d{4}-\d{2}-\d{2})-(\d{2}:\d{2})/, '$1 $2'))
    , hash: i[3]
    , status: i[4]
    }
  });
  return result;
}

check('prepub', 'http://a.tbcdn.cn/apps/vipmanager/1.0/js/power.js', function(err, results) {
  console.log(results);
});
check('cn1', 'http://a.tbcdn.cn/apps/tradeface/1.0/feedback.source.js', function(err, results) {
  console.log(results);
});
