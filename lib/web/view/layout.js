// vim: set sw=2 ts=2:

/**
 * @fileoverview 基本布局.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, next) {
  res.local('apps', _(WebConfig.apps).map(function(val, key) {
    return {
      href: key,
      name: val,
      active: req.params && req.params.apptype
    };
  }));

  WebUtil.partial(res, 'header');
  WebUtil.partial(res, 'footer');

  next();
};
