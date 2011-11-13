// vim: set sw=2 ts=2:

/**
 * @fileoverview taobao login for express.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var ascii2native = require('native2ascii').ascii2native;
var client = require('../database').client;
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
    client.query(
      'SELECT * FROM user WHERE name="?"',
      [username],
      function(err, results, fields) {
        if (results.length == 0) {
          client.query(
              'INSERT INTO user SET name=?, gmt_create=?, gmt_modified=?',
              [username, new Date, new Date],
              function(err, results, fields) {
                res.local('username', username);
                next();
              }
            );
          return;
        }

        res.local('username', results[0].name);
        next();
      });
  } catch (e) {
    console.error('LOGIN FAILED, %s', username);
    console.error(e.message);
    res.redirect(
      'https://login.taobao.com/member/login.jhtml?redirectURL=' +
      WebConfig.url + WebConfig.port + req.url);
    return;
  }

};
