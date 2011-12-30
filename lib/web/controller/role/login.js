// vim: set sw=2 ts=2:

/**
 * @fileoverview taobao login for express.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

function login(sessionId, callback) {
  var http = require('http');
  var opts = {
    host: 'sessionproxy.taobao.com',
    path: '/sessionproxy/getloginStatus?sessionid=' + sessionId
  };
  http.get(opts, function(res) {
    if (res.statusCode !== 200) {
      return callback(false,
        new Error('SessionProxy 访问异常, HTTPCODE: ' + res.statusCode));
    }

    var data = '';
    res.on('data', function(chunk) {
      data += chunk.toString('');
    });
    res.on('end', function() {
      var obj = {};
      _.each(data.split('&'), function(item) {
        item = item.split('=');
        obj[item[0]] = RmsUtil.GBKDecodeURI(item[1]);
      });
      callback(obj);
    });
  });
}

function redirectToLogin(res, url) {
  res.redirect(
    'https://login.taobao.com/member/login.jhtml?redirectURL=' +
    WebConfig.url + (RmsConfig.producing ? '' : ':' + WebConfig.port) + url);
}

module.exports = function(req, res, next) {
  if (_(WebConfig.noNeed2Auth).any(function(regex) {
    return regex.test(req.url);
  })) return next();
  var sessionId = req.cookies['cookie2'];
  login(sessionId, function(data) {
    if (!data.loginstatus) {
      return redirectToLogin(res, req.url);
    } else {
      var User = Model('user');
      var username = data.nick;
      var user = new User({name: username});
      try {
        return user.update(function() {
          res.local('user', user);
          next();
        });
      } catch (e) {
        rmsUtil.error('LOGIN FAILED, %s', username);
        rmsUtil.error(e);
        return redirectToLogin(res, req.url);
      }
    }
  });
};
