// vim: set sw=2 ts=2:

/**
 * @fileoverview 管理应用，更新，删除等.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/:apptype/:appname/admin/:action', function(req, res) {
  var appname = req.params.appname;
  var action = req.params.action;

  var App = require('../../model/app');

  var app = new App({
    name: appname
  });

  if (action === 'delete') {
    app.del(function() {
      res.redirect('/' + apptype);
    });
  }
});
