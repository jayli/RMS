// vim: set sw=2 ts=2:

/**
 * @fileoverview taobao login for express.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var ascii2native = require('native2ascii').ascii2native;
var client = require('../database').client;
var userModel = require('../model/user');
var roleModel = require('../model/role');

module.exports = function(req, res, next) {
  var username = req.cookies['_nk_'];
  if (!username) {
    res.redirect(
      'https://login.taobao.com/member/login.jhtml?redirectURL=' +
      WebConfig.url + WebConfig.port + req.url);
    return;
  }

  username = ascii2native(username.trim());

  function callback(err, results, fields) {
    if (err) {
      console.error(err);
      next();
      return;
    }

    roleModel.getRolesByUsername(username, function(err, results, fields) {
      err && console.error(err);
      res.local('roles', results);
      res.local('username', username);
      next();
    });
  }

  try {
    userModel.exists(username, function(userExist) {
      return userModel[userExist ? 'updateTime' : 'create'](username, callback);
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
