// vim: set sw=2 ts=2:

/**
 * @fileoverview 权限首页.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/role/:rolename', function(req, res) {
  var rolename = req.params.rolename;

  var user = res._locals.user;

  var Role = Model('role');

  // 仅有root用户可以进来
  user.isRoot(function(isroot) {
    if (!isroot) {
      res.local('error', '你没有权限访问. ');
      res.render('error');
      return;
    }

    res.local('apptype-href', 'role');
    res.local('apptype-name', '权限管理');

    WebUtil.partial(res, 'role');
    res.render('index');
  });

});
