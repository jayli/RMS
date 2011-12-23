// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布日志.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var actionLog = Model('log').actionLog;
var al = exports;

al.getBy = function(conditions, page, perPage, callback) {
  actionLog.getBy(conditions, page, perPage, function(err, results) {
    if (err) return callback(err, []);
    results.forEach(function(result, resultIndex) {
      result.success = !!result.service_log;
      result.pubtime = RmsUtil.formatDateTime(result.gmt_create);
      if (!result.success) return;

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

      var compressor = _(result.service_log.config.steps).find(function(item) {
        return item[0] === 'compressor';
      });
      result.service_log.compressor = compressor && compressor[1].tools.JavaScript;
    });
    callback(null, results);
  });
};
