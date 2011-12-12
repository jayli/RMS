// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布确认.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, apptype, appname, filepath, self) {
  res.redirect('/' + [apptype, appname].join('/'));
};
