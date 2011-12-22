// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布日志.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, apptype, appname, filepath, self, o) {
  var actionLog = Model('log').actionLog;
  res.local('title', '发布日志 - ' + apptype);
  actionLog.getBy({
    app_id: self.id
  }, 1, 10, function(err, results) {
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
    });
    res.local('logs', results);
    WebUtil.render(res, 'publog');
  });
};
