// vim: set sw=2 ts=2:

/**
 * @fileoverview show.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

module.exports = function(req, res, apptype, appname, filepath, self, o) {

  // 拆分路径给面包屑
  var filename, pathes = [];
  if (filepath) {
    var ps = filepath.replace(/^\//, '').split(/\//g);
    filename = ps.pop();

    ps.forEach(function(path, i) {
      pathes[i] = {
        href: ps.slice(0, i + 1).join('/'),
        name: path
      };
    });
  }

  res.local('app-filename', filename);
  res.local('pathes', pathes);

  var pubtypes = [];
  _(WebConfig.pubtypes).each(function(item, k) {
    pubtypes.push(_({key: k}).defaults(item));
  });
  res.local('pubtypes', pubtypes);
  console.log(pubtypes);

  if (!filename) {
    filename = _(pathes).last() || {name: ''};
    filename = filename.name;
  }

  var isDir = _.isObject(o);

  res.local('filename', filename + (isDir ? '/' : ''));

  // 直接显示文本内容，图片暂时不支持
  if (!isDir) {
    WebUtil.partial(res, 'file');

    var ext = require('path').extname(filename);
    res.local('app-fileextend', ext);
    if (WebUtil.isTxt(ext)) {
      res.local('txt', true);
    } else {
      res.local('preview-unsupported', true);
    }
    res.local('svn', o);
    WebUtil.render(res, 'detail');
  }

  // 显示文件列表
  else {
    WebUtil.partial(res, 'dir');

    var svn = require('../../../../service/svn/cmd');
    var cmd = new svn({
      path: self.svnpath,
      version: self.version
    });
    cmd.on('list', function(list) {
      res.local('svn', o);
      _(list).each(function(item) {
        item.dir = item.kind === 'dir';
      });
      list = _(list).sortBy(function(item) {
        return item.kind === 'dir' ? 0 : 1;
      });
      res.local('list', list);
      WebUtil.render(res, 'detail');
    });
  }
};
