// vim: set sw=2 ts=2:

/**
 * @fileoverview 全局错误拦截.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

RmsConfig.producing && App.all('*', function(req, res) {
  WebUtil.error(res, 'Route Not Found. ' + req.url);
});
