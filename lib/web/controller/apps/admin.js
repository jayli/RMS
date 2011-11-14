// vim: set sw=2 ts=2:

/**
 * @fileoverview 管理应用，更新，删除等.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var appModel = require('../../model/app');
App.get('/:apptype/:appname/admin/:action', function(req, res) {
  var apptype = req.params.apptype;
  var appname = req.params.appname;
  var action = req.params.action;

  if (action === 'delete') {
    appModel.deleteByName(appname, function(err, results, fields) {
      if (err) {
        res.local('message', {
          type: 'error',
          text: err.message
        });
      }
      res.redirect('/' + apptype);
    });
  }
});
