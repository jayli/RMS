// vim: set sw=2 ts=2:

/**
 * @fileoverview taobao login for express.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var ascii2native = require('native2ascii').ascii2native;
var User = require('../../model/user');

function login(sessionId, callback) {
  var http = require('http');
  var opts = {
    host: 'sessionproxy.taobao.com',
    path: '/sessionproxy/getSession?sessionid=' + sessionId
  };
  http.get(opts, function(res) {
    if (res.statusCode !== 200)
      return callback(false, new Error('SessionProxy 访问异常'));

    var data = '';
    res.on('data', function(chunk) {
      data += chunk.toString('');
    });
    res.on('end', function() {
      console.log(data.toString());
      callback(data.toString());
    });
  });
}

module.exports = function(req, res, next) {
  var sessionId = req.cookies['cookie2'];
  console.log(sessionId);
  login(sessionId, function(data) {
  });
  var username = req.cookies['_nk_'];
  if (!username) {
    res.redirect(
      'https://login.taobao.com/member/login.jhtml?redirectURL=' +
      WebConfig.url + WebConfig.port + req.url);
    return;
  }

  username = ascii2native(username.trim());

  var user = new User({name: username});

  try {
    return user.update(function() {
      user.getRoles(function(results) {
        res.local('user', user);
        res.local('roles', results);
        next();
      });
    });
  } catch (e) {
    console.error('LOGIN FAILED, %s', username);
    console.error(e);
    // next();
    res.redirect(
      'https://login.taobao.com/member/login.jhtml?redirectURL=' +
      WebConfig.url + WebConfig.port + req.url);
    return;
  }

};
