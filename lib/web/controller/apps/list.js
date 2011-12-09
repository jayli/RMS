// vim: set sw=2 ts=2:

/**
 * @fileoverview 应用列表.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/:apptype', function(req, res) {
  var apptype = req.params.apptype;

  if (!(apptype in WebConfig.apptypes))
    return WebUtil.error(res, 'Page Not Found. ' + req.url);

  res.local('title', '应用列表 - ' + WebConfig.apps[apptype]);
  res.local('apptype-href', apptype);
  res.local('apptype-name', WebConfig.apps[apptype]);

  var user = res._locals.user;
  user.getApps(WebConfig.apptypes[apptype], function(results) {
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
    WebUtil.render(res, 'applist');
  });
});
