// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布日志.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, apptype, appname, filepath, self, o) {
  var async = require('async');

  var actionLog = Model('log').actionLog;
  res.local('title', '发布日志 - ' + apptype);

  var conditions = {
    app_id: self.id
  };

  // TODO save to config
  var page = req.query.page ? +req.query.page : 1;
  var perPage = 10;
  var max = 10;

  async.parallel([

    function(callback) {
      actionLog.getBy(conditions, page, perPage, function(err, results) {
        results.forEach(function(result, resultIndex) {
          var files = [];
          var filelist = result.service_log.config.filelist;
          _(filelist).each(function(file, id) {
            files.push(file.filepath);
          });
          result.service_log.config.files = files;
          result.pubtype = _(WebConfig.pubtypes).find(function(item) {
            return item.type === result.service_log.config.pubtype;
          });
          result.service_log.status = WebConfig.statuses[result.service_log.status];
        });
        res.local('logs', results);
        callback(null, res);
      });
    }

  , function(callback) {
      actionLog.pageCount(conditions, perPage, function(err, count) {
        if (count <= 1) return callback(null, res);

        // TODO 把分页逻辑抽象的可以重用
        var pages = [];
        var pagesCount = Math.min(count, max);
        var start = page - (max / 2 - 1) > 0 ? page - (max / 2 - 1) : 1;
        var end = start + max - 1;
        _(pagesCount).times(function() {
          pages.push({
            active: start === page
          , count: start++
          });
        });
        res.local('pages', pages);
        res.local('pagination', {
          prev: Math.max(page - 1, 1)
        , next: Math.min(page + 1, count)
        , disablePrev: page - 1 < 1
        , disableNext: page + 1 > count
        });
        callback(null, res);
      });
    }

  ], function(err, resp) {
    WebUtil.render(_(resp).last(), 'publog');
  });

};
