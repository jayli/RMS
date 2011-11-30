// vim: set sw=2 ts=2:

/**
 * @fileoverview publish.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, apptype, appname, filepath, self, o) {
  var pubtype = req.query.type;
  WebUtil.partial(res, 'publish');

  res.local('pubtype', pubtype);
  res.local('title', '发布状态');
  var rmsClient = require('../../../../service/client');
  if (_.isString(o)) {
    var ext = require('path').extname(filepath);
    var type = WebConfig.rmsClientExts[ext];

    if (!type) {
      res.local('message', '暂时不支持处理这种文件：' + ext);
      return res.render('index');
    }

    var filelist = {};

    // TODO for supporting version and multiple files
    filelist[RmsUtil.md5(self.svnpath)] = {
      svnpath: self.svnpath,
      filepath: self.filepath,
    };

    var client = new rmsClient('', {
      type: type,
      async: true,
      appname: appname,
      pubtype: WebConfig.pubtypes[pubtype],
      filelist: filelist,
    });

    res.local('ids', _(client.config.filelist).keys().join('|'));

    res.local('filelist', _(client.config.filelist).map(function(path, idx) {
      return {id: idx, path: path.svnpath};
    }));

    // TODO make this configurable
    client.addStep('compressor');

    client.on('error', function(err) {
      res.local('error', err.message);
      return res.render('index');
    });
    client.on('response', function(obj) {
      if (!obj.success) {
        obj = _(obj).map(function(result, idx) {
          result.id = idx;
          return result;
        });
      }
      res.local('publishObject', obj);
      return res.render('index');
    });
    client.request();
  } else {
    res.local('message', '暂时不支持处理文件夹.');
    res.render('index');
  }

};
