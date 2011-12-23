// vim: set sw=2 ts=2:

/**
 * @fileoverview for all test speces.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get(/^\/test\/(\w+)\/?(\w+)?\/?(.+)?$/, function(req, res) {
  res.header['Content-Type'] = 'text/plain';
  res.send(require('util').inspect(req.params));
});
