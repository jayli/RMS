// vim: set sw=2 ts=2:

/**
 * @fileoverview publish page.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

define(function(require, exports) {
  var $ = require('jquery');
  var statuses = [
    '开始启动预处理任务',
    '预处理完成',
    '写入磁盘，推送pub100',
    'pub100推送cdn',
    '完成'
  ];
  exports.init = function(el) {
    var bar = $('.bar', el);
    var message = $('.message', el);
    var timer = setInterval(function() {
      require.async(el.data('href'), function(status) {
        bar.width(status.code * el.data('max') / el.data('step'));
        message.html(statuses[status.code]);
      });
    }, 1000);
  };
});
