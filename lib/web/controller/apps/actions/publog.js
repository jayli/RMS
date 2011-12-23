// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布日志.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, apptype, appname, filepath, self, o) {
  var async = require('async');

  var al = Controller('log');
  var page = req.query.page ? +req.query.page : 1;
  var perPage = WebConfig.pagination.itemPerPage;
  res.local('title', '发布日志 - ' + apptype);

  var conditions = {
    app_id: self.id
  };

  async.parallel([

    function(callback) {
      al.getBy(conditions, page, perPage, function(err, results) {
        res.local('logs', results);
        callback(null, res);
      });
    }

  , function(callback) {
      Model('log').actionLog.pageCount(conditions, perPage, function(err, count) {
        WebUtil.pagination(res, page, count, callback);
      });
    }

  ], function(err, resp) {
    WebUtil.render(_(resp).last(), 'publog');
  });

};
