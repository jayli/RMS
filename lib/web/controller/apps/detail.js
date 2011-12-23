// vim: set sw=2 ts=2:

/**
 * @fileoverview 应用detail.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.all(/^\/(\w+)\/(\w+)\/(\w+)\/?(.+)?$/, function(req, res) {

  var path = require('path');

  var apptype = req.params[0];
  var appname = req.params[1];
  var action = req.params[2];
  var filepath = req.params[3] || '';

  if (!WebConfig.actions[action]) {
    return WebUtil.error(res, 'Action unsupported. ' + action);
  }

  WebUtil.partial(res, 'pageHeader');

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

    var hasPermission = false;
    for (var i = 0, l = results.length; i < l; i++) {
      if (appname == results[i].name) {
        hasPermission = true;
        break;
      }
    }

    if (!hasPermission) {
      return WebUtil.error(res, '你没有权限访问. ' + appname)
    }

    app.update(function() {
      var self = this;

      if (!self.id) {
        return WebUtil.error(res, 'App not found. ' + appname);
      }

      res.local('app-name', self.name);

      self.svnpath = self.svnroot + (filepath || '');
      self.filepath = filepath;
      res.local('svnpath', self.svnpath);

      // TODO
      // 因为confirm和publish基本上就是获取上一级数据重绘
      // 分开需要Query和不需要Query的，或者在require里去分层
      // 另外publish走到service又会请求svn的
      var needQuery = ['confirm', 'publish'];

      if (needQuery.indexOf(action) !== -1) {
        // TODO 这参数传的有点恶心...
        require('./actions/' + action)
          (req, res, apptype, appname, filepath, self);
      } else {
        svnquery(self.svnpath || self.svnroot,
            RmsConfig.svn, function(err, o, version) {
          if (err) {
            res.local('message', {
              type: 'error',
              text: err.message
            });
            return WebUtil.render(res, 'detail');
          }

          self.version = version;

          res.local('prefix', filepath);
          res.local('version', self.version);

          // TODO 这参数传的有点恶心...
          require('./actions/' + action)
            (req, res, apptype, appname, filepath, self, o);
        });
      }
    });
  });

});
