// vim: set sw=2 ts=2:

/**
 * @fileoverview topbar content.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, next) {
  var apps = [];
  for (var i in WebConfig.apps) {
    apps.push({
      href: i,
      name: WebConfig.apps[i],
      active: req.params && req.params.apptype
    });
  }

  res.local('apps', apps);

  WebUtil.partial(res, 'header');
  WebUtil.partial(res, 'footer');

  next();
};
