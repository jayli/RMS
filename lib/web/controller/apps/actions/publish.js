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
    var originalPubList = _.isArray(req.body.publist) ?
      req.body.publist : [req.body.publist];

    var publist = [];
    var recursiveGetDirList = [];
    var svnlist = require('../../../../service/svn/cmd');
    var async = require('async');

    // TODO 这里循环把目录做递归处理
    _(originalPubList).each(function(o) {
      o = o.split('|');
      var item = {
        path: o[0]
      , rev: +o[1]
      };
      if (_(item.path).last() === '/') {
        recursiveGetDirList.push(function(callback) {
          new svnlist({
            path: self.svnpath + item.path
          , version: item.rev
          , extra: ['-R']
          }).on('list', function(list) {
            var filelist = [];
            _(list).each(function(file) {
              if (file.kind === 'file') {
                filelist.push({
                  path: item.path + file.name
                , rev: +file.commit.revision
                });
              }
            });
            callback(null, filelist);
          }).on('stderr', function(data) {
            callback(new Error(data));
          });
        });
      } else {
        publist.push(item);
      };
    });

    if (recursiveGetDirList.length === 0) {
      return queryService();
    }

    async.parallel(recursiveGetDirList, function(err, data) {
      publist = publist.concat(_(data).flatten());
      _(publist).each(function(item) {
        console.log(item);
      });
      queryService();
    });

    function queryService() {
      var filelist = {};

      _(publist).each(function(item) {
        filelist[RmsUtil.md5(self.svnroot + item.path + '|' + item.rev)] = {
          rev: item.rev
        , svnpath: self.svnroot + item.path
        , filepath: item.path
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

      new ActionLog({
        oper_id: client.config.id
      , app_id: self.id
      , user_id: res._locals.user.id
      }).save(function() {
        client.request();
      });
    }

  }

  // GET走DB查询发布日志
  else {
    ServiceLog.getByOperId(pubId, function(err, obj) {
      var filelist = obj.config.filelist;
      res.local('operId', pubId);
      res.local('time', {
        start: RmsUtil.formatDateTime(obj.gmt_create)
      , end: RmsUtil.formatDateTime(obj.end)
      });
      res.local('pubtype', _(WebConfig.pubtypes).find(function(item) {
        return item.type === obj.config.pubtype;
      }));
      res.local('filelist', _(filelist).map(function(file, idx) {
        return {id: idx, path: file.filepath, rev: file.rev};
      }));
      return WebUtil.render(res, 'publish');
    });
  }

};
