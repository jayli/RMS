var http = require('http');
var crypto = require('crypto');
var url = require('url');
var md5 = function(str) {
  return crypto.createHash('MD5').update(str).digest('hex');
};
var _ = require('underscore');
var xml2json = require('xml2json').toJson;
var gbk2utf8 = require('../../rmsUtil').gbk2utf8;

function bind(resp, opts, callback) {
  var data = '';
  resp.on('data', function(chunk) {
    data += gbk2utf8(chunk);
  });
  resp.on('end', function() {
    if (opts.path[opts.path.length - 1] != '/') {
      callback(null, data);
    } else {
      data = data.toString();
      var obj = JSON.parse(xml2json(data));
      callback(null, obj.svn.index);
    }
  });
}

function query(opts, user, callback) {
  if (typeof opts === 'string') {
    var o = url.parse(opts);
    opts = {
      host: o.host,
      path: o.path,
      method: 'GET'
    };
  }

  http.request(opts, function(res) {
    if (res.statusCode !== 401) {
      bind(res, opts, callback);
      return;
    }

    res.on('end', function() {

      var params = parseDigest(res.headers['www-authenticate']);

      params.nc = 1;
      params.cnonce = '';

      var h1 = md5([user.username, params.realm, user.password].join(':'));
      // rmsUtil.log(h1);

      var h2 = md5([opts.method, opts.path].join(':'));
      // rmsUtil.log(h2);

      var h3 = md5([
        h1,
        params.nonce,
        params.nc,
        params.cnonce,
        params.qop,
        h2
      ].join(':'));
      // rmsUtil.log(h3);

      var authString = renderDigest({
        username: user.username,
        realm: params.realm,
        nonce: params.nonce,
        uri: opts.path,
        qop: params.qop,
        nc: params.nc,
        cnonce: params.cnonce,
        response: h3,
        algorithm: params.algorithm
      });
      // rmsUtil.log(authString);

      opts.headers = {
        Authorization: authString
      };

      http.request(opts, function(resp) {
        if (resp.statusCode === 200) {
          return bind(resp, opts, callback);
        }

        var err = new Error('StatusCode: ' + resp.statusCode);
        err.statusCode = resp.statusCode;
        callback(err, null);

      }).end();

    });

  }).end();
}

function parseDigest(header) {
  return _(header.substring(7).split(/,\s+/)).reduce(function(obj, s) {
    var parts = s.split('=');
    var key = parts.shift();
    parts.forEach(function(a, b) {
      parts[b] = a.replace(/"/g, '');
    });
    obj[key] = parts.join('=');
    return obj;
  }, {});
}

function renderDigest(params) {
  var s = _(_.keys(params)).reduce(function(s1, ii) {
    if (['nc', 'qop', 'algorithm'].indexOf(ii) != -1) {
      return s1 + ', ' + ii + '=' + params[ii];
    } else {
      return s1 + ', ' + ii + '="' + params[ii] + '"';
    }
  }, '');
  return 'Digest ' + s.substring(2);
}

module.exports = query;
