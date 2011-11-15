// vim: set sw=2 ts=2:

/**
 * @fileoverview 管理应用，更新，删除等.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/:apptype/:appname/admin/:action', function(req, res) {
  var appname = req.params.appname;
  var apptype = req.params.apptype;
  var action = req.params.action;

  if (action in admin) {
    WebUtil.partial(res, 'admin');
    res.local('admin', true);
    res.local('apptype-name', apptype);
    res.local('apptype-href', apptype);
    res.local('app-name', '应用管理');
    res.local('app-href', appname + '/admin');
    admin[action](appname, res);
    return;
  }

  res.local('error', 'Action not found');
  res.render('error');
});

var admin = {
  'delete': function(appname, res) {
    var App = require('../../model/app');
    var app = new App({
      name: appname
    });
    app.del(function() {
      res.redirect('/' + apptype);
    });
  },
  'role': function(appname, res) {
    var App = require('../../model/app');
    var app = new App({
      name: appname
    });
    app.update(function() {
      app.getUsers(function(users) {
        res.local('users', users);
        res.render('index');
      });
    });
  }
};
