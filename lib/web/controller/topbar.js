// vim: set sw=2 ts=2:

/**
 * @fileoverview topbar content.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var _ = require('underscore');
var fs = require('fs');
var path = require('path');

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
  res.local('partials', {
    'topbar': fs.readFileSync(path.join(res.app.settings.views,
        'topbar.mustache')).toString()
  });

  next();
};
