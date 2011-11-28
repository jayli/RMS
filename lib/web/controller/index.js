// vim: set sw=2 ts=2:

/**
 * @fileoverview 首页.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/', function(req, res) {
  res.local('home', true);
  WebUtil.partial(res, 'home');

  var user = res._locals.user;
  user.getApps(function(results) {
    res.local('apptype-href', '');
    res.local('apptype-name', '首页');
    // rmsUtil.log(results);
    res.render('index');
  });
});
