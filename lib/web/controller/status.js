// vim: set sw=2 ts=2:

/**
 * @fileoverview service log status.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var ServiceLog = Model('log').serviceLog;
App.get('/status/:id', function(req, res) {
  var id = req.params.id, obj = {};
  ServiceLog.getByOperId(id, function(err, status) {
    status.oper_end = RmsUtil.formatDateTime(status.oper_end);
    return res.send(status);
  });
});
