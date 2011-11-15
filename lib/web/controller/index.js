// vim: set sw=2 ts=2:

/**
 * @fileoverview 首页.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/', function(req, res) {
  res.local('index', true);
  var user = res._locals.user;
  user.getApps(function(results) {
    // console.log(results);
  });
  res.render('index');
});

