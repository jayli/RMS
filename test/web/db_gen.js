global.WebConfig = require('../../lib/web/config');
var db = require('../../lib/web/database');

db.create({
  name: 'assets',
  svnroot: 'http://svn.taobao-develop.com/repos/assets/trunk/assets',
  type: 0,
  version: 47041
}, function(err, results, fields) {
  console.log(results);
  db.client.end();
});


/*
db.delete(10, function(results, fields) {
  console.log(results);
});
*/
