// vim: set sw=2 ts=2:

/**
 * @fileoverview 应用列表.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var appModel = require('../../model/app');
App.get('/:apptype', function(req, res) {
  var apptype = req.params.apptype;

  res.local('title', '应用列表 - ' + WebConfig.apps[apptype]);
  res.local('apptype-href', apptype);
  res.local('apptype-name', WebConfig.apps[apptype]);

  WebUtil.partial(res, 'list');
  appModel.getAll(apptype, function(err, results, fields) {
    var list = [];
    results.forEach(function(result) {
      list.push({
        'app-id': result.id,
        'app-name': result.name,
        'app-version': result.version,
        'app-svnroot': result.svnroot
      });
    });
    res.local('list', list);
    res.render('index');
  });
});
