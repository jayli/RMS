var svnquery = require('../lib/service/svn/query');
var svn = require('../lib/service/svn/cmd');
var vows = require('vows');

var path = 'http://svn.taobao-develop.com/repos/tms';
svnquery(path, {
  username: 'assetsadmin',
  password: 'scm1234'
}, function(err, data, version) {

  var command = new svn({
    path: path,
    version: version
  });

  command.on('list', function(list) {
    console.log(1);
    console.log(list);
  });
});
