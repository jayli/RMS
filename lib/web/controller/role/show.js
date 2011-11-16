// vim: set sw=2 ts=2:

/**
 * @fileoverview 权限首页.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.redirect('role', '/role');
App.get('/role/:action?', function(req, res) {
  var rolename = req.params.rolename;
  var action = req.params.action;

  var user = res._locals.user;

  // 仅有root用户可以进来
  user.isRoot(function(isroot) {
    if (!isroot) {
      res.local('error', '你没有权限访问. ');
      res.render('error');
      return;
    }

    var Role = Model('role');
    var rolename = req.query.rolename;
    if (rolename) {
      Role.addRole(rolename, function() {
        res.redirect('role');
      });
      return;
    }

    res.local('apptype-href', 'role');
    res.local('apptype-name', '权限管理');

    res.local('role', true);

    Role.getAll(function(results) {
      res.local('roles', results);
      WebUtil.partial(res, 'role');
      res.render('index');
    });
  });

});
