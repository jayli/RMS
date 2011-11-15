// vim: set sw=2 ts=2:

/**
 * @fileoverview 权限首页.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var Role = require('../../model/role');
App.get('/role/:rolename', function(req, res) {
  var rolename = req.params.rolename;

  var role = new Role({name: rolename});
  role.exist(function(exist) {
    if (!exist) {
      res.local('error', 'Role not exist. ', rolename);
      res.render('index');
      return;
    }

    role.getUsers(function(results) {
      res.local('role-list', true);
      res.local('users', results);
      res.local('title', '权限管理');

      res.local('apptype-href', 'role');
      res.local('apptype-name', '权限管理');

      res.local('app-name', rolename);

      WebUtil.partial(res, 'role');
      res.render('index');
    });
  });
});
