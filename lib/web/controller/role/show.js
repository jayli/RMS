// vim: set sw=2 ts=2:

/**
 * @fileoverview 权限首页.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/role/:action?/:id?/:subaction?', function(req, res) {
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
      var subaction = req.params.subaction;

      var subactions = {
        adduser: function() {
          var roleid = req.params.id;
          var username = req.query.username;
          if (username) {
            // 提交上来的
            var roleid = req.query.roleid;
            new Role({id: roleid}).addUser(username, function() {
              res.redirect('/role/edit/' + roleid);
            });
          } else {
            console.error('参数不全');
            res.redirect('/role/edit/' + roleid);
          }
        },
        removeuser: function() {
          // 提交上来的
          var roleid = req.params.id;
          var userid = req.query.userid;
          if (userid) {
            new Role({id: roleid}).removeUser(userid, function() {
              res.redirect('/role/edit/' + roleid);
            });
          } else {
            console.error('参数不全');
            res.redirect('/role/edit/' + roleid);
          }
        }
      };

      // 子操作，删除和添加用户
      if (subaction in subactions) return subactions[subaction]();

      // 左边列表
      var id = req.params.id;
      if (!id) return res.redirect('/role');

      Role.existById(id, function(exist, results) {
        if (exist) {
          res.local('roleid', results[0].id);
          res.local('rolename', results[0].name);
          new Role({
            id: results[0].id,
            name: results[0].name
          }).getUsers(function(results) {
            res.local('users', results);
            list();
          });
        } else {
          list();
        }

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
