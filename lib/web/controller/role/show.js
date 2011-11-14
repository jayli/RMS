// vim: set sw=2 ts=2:

/**
 * @fileoverview 权限首页.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var roleModel = require('../../model/role');
App.get('/role/:rolename', function(req, res) {
  var rolename = req.params.rolename;

  roleModel.getUsersByRolename(rolename, function(err, results, fields) {
    err && console.error(err);

    res.local('role-list', true);
    res.local('users', results);
    res.local('title', '权限');

    res.local('apptype-href', 'role');
    res.local('apptype-name', '权限管理');

    res.local('app-name', rolename);

    WebUtil.partial(res, 'role');
    res.render('index');
  });
});
