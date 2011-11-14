// vim: set sw=2 ts=2:

/**
 * @fileoverview taobao login for express.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var ascii2native = require('native2ascii').ascii2native;
var client = require('../database').client;
var userModel = require('../model/user');
module.exports = function(req, res, next) {
  var username = req.cookies['_nk_'];
  if (!username) {
    res.redirect(
      'https://login.taobao.com/member/login.jhtml?redirectURL=' +
      WebConfig.url + WebConfig.port + req.url);
    return;
  }

  username = ascii2native(username.trim());

  try {
    userModel.exists(username, function(userExist) {
      if (!userExist) {
        userModel.create({
          name: username
        }, function(err, results, fields) {
          res.local('username', username);
          next();
        });
        return;
      }

      userModel.updateTime(username, function(err, results, fields) {
        res.local('username', username);
        next();
      });
    });
  } catch (e) {
    console.error('LOGIN FAILED, %s', username);
    console.error(e.message);
    // next();
    res.redirect(
      'https://login.taobao.com/member/login.jhtml?redirectURL=' +
      WebConfig.url + WebConfig.port + req.url);
    return;
  }

};
