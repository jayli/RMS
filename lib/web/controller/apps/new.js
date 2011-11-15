// vim: set sw=2 ts=2:

/**
 * @fileoverview 新建应用.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/apps/new', function(req, res) {
  // create a new instance

  function newapp() {
    res.local('newapp', true);
    res.local('title', '创建应用');
    var apptypes = [];
    for (var i in WebConfig.apps) {
      apptypes.push({
        value: WebConfig.apptypes[i],
        name: WebConfig.apps[i]
      });
    }
    res.local('apptypes', apptypes);
    WebUtil.partial(res, 'newapp');
  }

  if (req.query.apptype &&
      req.query.appname &&
      req.query.svnroot) {

    // 给根目录补全最后一个斜杠
    // 避免读svn的时候有一次301
    if (!/\/$/.test(req.query.svnroot))
      req.query.svnroot += '/';

    svnquery(req.query.svnroot, RmsConfig.svn, function(err, o) {
      if (err) {
        res.local('message', {
          type: 'error',
          text: err.message
        });
        newapp();
        res.render('index');
        return;
      }

      var App = require('../../model/app');
      var app = new App({
        name: req.query.appname,
        svnroot: req.query.svnroot,
        type: req.query.apptype,
        version: +o.rev
      });
      app.create(function() {
        if (!success) {
          res.local('message', {
            type: 'error',
            text: err.message
          });
        } else {
          res.local('message', {
            type: 'success',
            text: '应用创建成功！'
          });
        }
        newapp();
        res.render('index');
      });
    });
  } else {
    newapp();
    res.render('index');
  }
});
