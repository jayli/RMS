// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, apptype, appname, pubId, self) {
  res.local('title', '发布状态');

  // POST
  if (req.body) {

    var rmsClient = require('../../../../service/client');
    var pubtype = req.body.type;
    res.local('pubtype', pubtype);
    var publist = _.isArray(req.body.publist) ?
      req.body.publist :
      [req.body.publist];

    _(publist).map(function(item, idx) {
      item = item.split('|');
      publist[idx] = {
        path: item[0]
      , rev: +item[1]
      };
    });

    var filelist = {};

    _(publist).each(function(item) {
      filelist[RmsUtil.md5(self.svnroot + item.path + '|' + item.rev)] = {
        svnpath: self.svnroot + item.path,
        filepath: item.path,
      };
    });
    console.log(filelist);

    res.local('ids', _(filelist).keys().join('|'));
    res.local('filelist', _(filelist).map(function(path, idx) {
      return {id: idx, path: path.svnpath};
    }));

    var client = new rmsClient(null, {
      async: true,
      appname: appname,
      pubtype: WebConfig.pubtypes[pubtype].type,
      filelist: filelist,
    });

    // TODO make this configurable
    var compressor = req.body.compressor;
    if (compressor !== 'null') {
      client.addStep('compressor', {
        tools: {JavaScript: compressor}
      });
    }

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
  }

  // GET走DB查询发布日志
  else {
    return WebUtil.render(res, 'publish');
  }

};
