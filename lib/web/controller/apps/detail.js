// vim: set sw=2 ts=2:

/**
 * @fileoverview 应用detail.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var path = require('path');
App.get('/:apptype/:appname/:action/*?', function(req, res) {

  var action = req.params.action
  if (!WebConfig.actions[action]) {
    return WebUtil.error(res, 'Action unsupported. ' + action);
  }

  var apptype = req.params.apptype;
  var appname = req.params.appname;
  var filepath = req.params.shift();

  res.local('apptype-href', apptype);
  res.local('apptype-name', WebConfig.apps[apptype]);

  // 获取单个应用列表
  var App = Model('app');
  var app = new App({
    name: appname
  });

  var user = res._locals.user;

  user.getApps(WebConfig.apptypes[apptype], function(results) {
    var list = [];

    var hasRight = false;
    for (var i = 0, l = results.length; i < l; i++) {
      if (appname == results[i].name) {
        hasRight = true;
        break;
      }
    }

    if (!hasRight) {
      return WebUtil.error(res, '你没有权限访问. ' + appname)
    }

    app.update(function() {
      var self = this;

      if (!self.id) {
        return WebUtil.error(res, 'App not found. ' + appname);
      }

      res.local('app-name', self.name);

      if (filepath) {
        self.svnroot += filepath;
        res.local('svnpath', self.svnroot);
      }

      svnquery(self.svnroot, RmsConfig.svn, function(err, o) {
        if (err) {
          if (err.statusCode === 301) {
            res.redirect(req.url + '/');
            return;
          }
          res.local('message', {
            type: 'error',
            text: err.message
          });
          res.local('app-detail', true);
          WebUtil.partial(res, 'detail');
          res.render('index');
          return;
        }

        res.local('prefix', filepath);

        require('./actions/' + action)
          (req, res, apptype, appname, filepath, self, o);
      });

    });
  });

});
