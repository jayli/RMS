// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, apptype, appname, pubId, self) {
  res.local('title', '发布状态');
  var Log = Model('log');
  var ActionLog = Log.actionLog;
  var ServiceLog = Log.serviceLog;

  // POST
  if (req.body) {

    var rmsClient = require('../../../../service/client');
    var pubtype = req.body.type;
    res.local('pubtype', pubtype);
    var publist = _.isArray(req.body.publist) ?
      req.body.publist : [req.body.publist];

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

    var client = new rmsClient(null, {
      id: RmsUtil.UUID
    , async: true
    , appname: appname
    , pubtype: WebConfig.pubtypes[pubtype].type
    , filelist: filelist
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

      // POST完后直接redirect /publish/:id
      return res.redirect('/' + [apptype, appname, 'publish', this.config.id].join('/'));
    });

    var actionLog = new ActionLog({
      oper_id: client.config.id
    , app_id: self.id
    , user_id: res._locals.user.id
    });
    actionLog.save(function() {
      client.request();
    });
  }

  // GET走DB查询发布日志
  else {
    ServiceLog.getByOperId(pubId, function(err, obj) {
      var filelist = obj.config.filelist;
      res.local('operId', pubId);
      res.local('pubtype', pubtype);
      res.local('ids', _(filelist).keys().join('|'));
      res.local('filelist', _(filelist).map(function(path, idx) {
        return {id: idx, path: path.svnpath};
      }));
      return WebUtil.render(res, 'publish');
    });
  }

};
