// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, apptype, appname, filepath, self, o) {
  var rmsClient = require('../../../../service/client');

  var pubtype = req.query.type;

  res.local('pubtype', pubtype);
  res.local('title', '发布状态');

  if (_.isString(o)) {

    var ext = require('path').extname(filepath);
    var type = WebConfig.rmsClientExts[ext];

    if (!type) {
      res.local('message', '暂时不支持处理这种文件：' + ext);
      return WebUtil.render(res, 'publish');
    }

    var filelist = {};

    // TODO for supporting version and multiple files
    filelist[RmsUtil.md5(self.svnpath)] = {
      svnpath: self.svnpath,
      filepath: self.filepath,
    };

    var client = new rmsClient(null, {
      type: type,
      async: true,
      appname: appname,
      pubtype: WebConfig.pubtypes[pubtype].type,
      filelist: filelist,
    });

    res.local('ids', _(client.config.filelist).keys().join('|'));

    res.local('filelist', _(client.config.filelist).map(function(path, idx) {
      return {id: idx, path: path.svnpath};
    }));

    // TODO make this configurable
    client.addStep('compressor');

    client.on('error', function(err) {
      res.local('message', err.message);
      return WebUtil.render(res, 'publish');
    });
    client.on('response', function(obj) {
      if (!obj.success) {
        obj = _(obj).map(function(result, idx) {
          result.id = idx;
          return result;
        });
      }
      res.local('publishObject', obj);
      return WebUtil.render(res, 'publish');
    });
    client.request();
  } else {
    res.local('message', '暂时不支持处理文件夹.');
    return WebUtil.render(res, 'publish');
  }

};
