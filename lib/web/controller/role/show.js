// vim: set sw=2 ts=2:

/**
 * @fileoverview 权限首页.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/role/:action?/:id?', function(req, res) {
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
    if (action === 'edit') {

      var rolename = req.query.rolename;
      if (rolename) {
        // 提交上来的
        var users = req.query.users;
        users = users && users.split(/\s*,\s*/) || [];
        Role.addRole(rolename, function() {
          users.forEach(function(user) {
            // console.log(user);
          });
          return res.redirect('/role');
        });
        return;
      }

      var id = req.params.id;
      if (!id) {
        return res.redirect('/role');
      }

      Role.existById(id, function(exist, results) {
        if (exist) {
          // console.log(results);
          res.local('roleid', results[0].id);
          res.local('rolename', results[0].name);
        }

        new Role({
          id: results[0].id,
          name: results[0].name
        }).getUsers(function(results) {
          results.forEach(function(user, idx) {
            results[idx] = user.name;
          });
          res.local('users', results.join(','));
          list();
        });
      });
      return;

    }

    function list() {
      res.local('apptype-href', 'role');
      res.local('apptype-name', '权限管理');

      res.local('role', true);
      WebUtil.partial(res, 'role');

      Role.getAll(function(results) {
        res.local('roles', results);
        res.render('index');
      });
    }

    list();

  });

});
