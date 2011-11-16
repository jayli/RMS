// vim: set sw=2 ts=2:

/**
 * @fileoverview taobao login for express.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var ascii2native = require('native2ascii').ascii2native;
var User = require('../../model/user');

module.exports = function(req, res, next) {
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
