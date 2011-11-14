// vim: set sw=2 ts=2:

/**
 * @fileoverview 应用detail.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var path = require('path');
var appModel = require('../../model/app');
App.get('/:apptype/:appname/:action/*?', function(req, res) {

  var apptype = req.params.apptype;
  var appname = req.params.appname;
  var action = req.params.action;
  var filepath = req.params.shift();

  res.local('apptype-href', apptype);
  res.local('apptype-name', WebConfig.apps[apptype]);

  if (!WebConfig.actions[action]) {
    res.local('error', 'Action unsupported. ' + action);
    res.render('error');
    res.render('index');
    return;
  }

  // 获取单个应用列表
  appModel.getByName(appname, function(err, results, fields) {
    var result = results[0];

    if (!result) {
      res.local('error', 'App Not Found. ' + appname);
      res.render('error');
      return;
    }

    if (err) {
      res.local('error', 'Error: ' + err.message);
      res.render('error');
      return;
    }

    res.local('app-name', result.name);

    if (filepath) {
      result.svnroot += filepath;
    }

    svnquery(result.svnroot, RmsConfig.svn, function(err, o) {
      if (err) {
        if (err.statusCode === 301) {
          res.redirect(req.url + '/');
          return;
        }
        res.local('message', {
          type: 'error',
          text: err.message
        });
        WebUtil.partial(res, 'detail');
        res.render('index');
        return;
      }
      res.local('prefix', filepath);

      var filename = '';
      if (filepath) {
        var ps = filepath.split(/\//g);
        filename = ps.pop();
        res.local('app-filename', filename);

        var pathes = [];
        ps.forEach(function(path, i) {
          pathes[i] = {
            href: ps.slice(0, i + 1).join('/'),
            name: path
          };
        });

        res.local('pathes', pathes);
      }

      if (typeof o !== 'object') {
        var ext = path.extname(filename);
        res.local('app-fileextend', ext);
        if (WebUtil.isTxt(ext)) {
          res.local('txt', true);
        } else {
          res.local('preview-unsupported', true);
        }

        res.local('app-file', true);
        WebUtil.partial(res, 'file');
      }

      res.local('svn', o);
      WebUtil.partial(res, 'detail');
      res.render('index');
    });
  });
});
