// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布日志.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, apptype, appname, filepath, self, o) {
  WebUtil.render(res, 'publog');
};
