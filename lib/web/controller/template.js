// vim: set sw=2 ts=2:

/**
 * @fileoverview 获取裸模版.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/template/:template', function(req, res) {
  var template = req.params.template;
  var path = require('path').join(__dirname, '../view/template', template + '.mustache');
  require('fs').readFile(path, function(err, content) {
    return res.send(err || content);
  });
});
