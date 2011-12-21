var http = require('http');
var url = require('url');
var _ = require('underscore');
var xml2json = require('xml2json').toJson;
var rmsUtil = require('../../rmsUtil');

function bind(resp, opts, callback) {
  var data;
  resp.on('data', function(chunk) {
    data = data ? rmsUtil.concatBuffer(data, chunk) : chunk;
  });
  resp.on('end', function() {
    var isBin = resp.headers['content-type'] === 'application/octet-stream';
    if (!isBin) data = rmsUtil.gbk2utf8(data).toString();
    var version = getVersionFromEtag(resp.headers['etag']);
    if (opts.path[opts.path.length - 1] !== '/') {
      // 这参数也传的有点恶心
      callback(null, data, version, isBin);
    } else {
      var obj = JSON.parse(xml2json(data));
      callback(null, obj.svn.index, obj.svn.index.rev, isBin);
    }
  });
}

function getVersionFromEtag(str) {
  if (!str) return 1;
  return +(str.replace(/^[^"]*"([0-9]+).*"/g, "$1") || '');
};

function query(opts, user, callback) {
  if (_.isString(opts)) {
    var o = url.parse(opts);
    opts = {
      host: o.host,
      path: o.path,
      method: 'GET'
    };
  }

  http.request(opts, function(res) {
    if (res.statusCode !== 401) {
      return bind(res, opts, callback);
    }

    res.on('end', function() {

      opts.headers = {
        Authorization: digestAuth(res, opts, user)
      };

      http.request(opts, function(resp) {
        if (resp.statusCode === 200) {
          return bind(resp, opts, callback);
        }

        if (resp.statusCode === 301) {
          return query(resp.headers['location'], user, callback);
        }

        var err = new Error('StatusCode: ' + resp.statusCode);
        err.statusCode = resp.statusCode;
        callback(err, null);

      }).end();

    });

  }).end();
}

function digestAuth(res, opts, user) {
  var params = parseDigest(res.headers['www-authenticate']);

  params.nc = 1;
  params.cnonce = '';

  var h1 = rmsUtil.md5([user.username, params.realm, user.password].join(':'));
  // rmsUtil.log(h1);

  var h2 = rmsUtil.md5([opts.method, opts.path].join(':'));
  // rmsUtil.log(h2);

  var h3 = rmsUtil.md5([
    h1,
    params.nonce,
    params.nc,
    params.cnonce,
    params.qop,
    h2
  ].join(':'));
  // rmsUtil.log(h3);

  return renderDigest({
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
