// vim: set sw=2 ts=2:

/**
 * @fileoverview 首页.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

App.get('/', function(req, res) {
  var async = require('async');
  var user = res._locals.user;
  async.parallel({
    apps: function(callback) {
      user.getApps(function(results) {
        results.forEach(function(item) {
          for (var i in WebConfig.apptypes) {
            if (WebConfig.apptypes[i] === item.type) {
              item.type = i;
              break;
            }
          }
        });
        callback(null, results);
      });
    }
  , logs: function(callback) {
      var al = Controller('log');
      al.getBy({
        user_id: user.id
      }, 1, 5, callback);
    }
  }, function(err, data) {
    res.local('applist', data.apps);
    res.local('logs', data.logs);
    res.local('apptype-href', '');
    res.local('apptype-name', '首页');
    res.render('home');
  });
});
