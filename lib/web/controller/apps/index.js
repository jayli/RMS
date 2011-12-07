// vim: set sw=2 ts=2:

/**
 * @fileoverview 应用首页.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var path = require('path');
var appModel = require('../../model/app');
App.get('/:apptype/:appname', function(req, res) {
  // TODO 首页先转到show
  if (req.params.apptype in WebConfig.apps) {
    return res.redirect(req.url.replace(/\/$/, '') + '/show/');
  } else {
    return WebUtil.error(res, 'Page Not Found');
  }
});
