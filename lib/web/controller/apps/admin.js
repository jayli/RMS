// vim: set sw=2 ts=2:

/**
 * @fileoverview 管理应用，更新，删除等.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/:apptype/:appname/admin/:action?', function(req, res) {
  var appname = req.params.appname;
  var apptype = req.params.apptype;
  var action = req.params.action;
  if (!action) {
    action = 'permission';
  }

  if (action in admin) {
    WebUtil.partial(res, 'admin');
    res.local('admin', true);
    res.local('apptype-name', apptype);
    res.local('apptype-href', apptype);
    res.local('app-name', '应用管理');
    res.local('app-href', appname);
    admin[action](appname, req, res);
    return;
  }

  res.local('error', 'Action not found');
  res.render('error');
});

var admin = {
  'delete': function(appname, req, res) {
    var App = require('../../model/app');
    var app = new App({
      name: appname
    });
    app.del(function() {
      res.redirect('/' + apptype);
    });
  },
  'permission': function(appname, req, res) {
    var user = res._locals.user;

    if (!user.isroot) {
      res.local('error', '您没有权限访问.');
      res.render('index');
      return;
    }

    var App = Model('app');
    var app = new App({
      name: appname
    });

    var Role = Model('role');
    function list() {
      Role.getAll(function(results) {
        app.update(function() {
          app.getRoles(function(roles) {
            results.forEach(function(role, idx) {
              roles.forEach(function(on) {
                if (role.id === on.id)
                  results[idx].active = true;
              });
            });
            res.local('roles', results);
            res.render('index');
          });
        });
      });
    }

    var addrole = req.query.addrole;
    if (addrole) {
      Model('role').addRole(addrole, list);
    } else {
      list();
    }

  }
};

App.get(
  '/:apptype/:appname/admin/permission/:action/:roleid', function(req, res) {
    var App = Model('app');
    var app = new App({
      name: req.params.appname
    });
    var actionMap = {
      'add': 'addRole',
      'delete': 'removeRole'
    };
    var action = req.params.action;
    app.update(function() {
      if (action in actionMap) {
        app[actionMap[action]](req.params.roleid, function(results) {
          res.redirect('/' + [
            req.params.apptype,
            req.params.appname,
            'admin',
            'permission'
          ].join('/'));
        });
      } else {
        res.redirect('/' + [
          req.params.apptype,
          req.params.appname,
          'admin'
        ].join('/'));
      }
    });
  });
