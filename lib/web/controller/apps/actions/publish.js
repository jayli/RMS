// vim: set sw=2 ts=2:

/**
 * @fileoverview publish.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, apptype, appname, filepath, self, o) {
  var pubtype = req.query.type;
  WebUtil.partial(res, 'publish');

  res.local('pubtype', pubtype);
  var rmsClient = require('../../../../service/client');
  if (typeof o === 'string') {
    var ext = require('path').extname(filepath);
    var type = WebConfig.rmsClientExts[ext];

    if (!type) {
      res.local('message', '暂时不支持处理这种文件：' + ext);
      return res.render('index');
    }

    var client = new rmsClient('', {
      type: type,
      //async: true,
      path: self.svnroot
    });
    client.addStep('compressor');
    client.on('error', function(err) {
      res.local('error', err.message);
      return res.render('index');
    });
    client.on('response', function(obj) {
      res.local('content', obj.result);
      res.local('message', obj.message || '编译成功，开始发布.');
      return res.render('index');
    });
    client.request();
  } else {
    res.local('message', '暂时不支持处理文件夹.');
    res.render('index');
  }

};
