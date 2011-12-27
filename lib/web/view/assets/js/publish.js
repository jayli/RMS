// vim: set sw=2 ts=2:

/**
 * @fileoverview publish page.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

define(function(require, exports) {
  var $ = require('jquery');
  var statuses = [
    '开始启动预处理任务'
  , '预处理完成'
  //, '写入磁盘，推送PUB100'
  //, '推送CDN'
  //, '发布完成'
  ];
  exports.init = function(el) {
    var timer = setInterval(function() {
      require.async(el.data('href') + '&t=' + +new Date, function(result) {
        var status = result;
        if (status.status >= statuses.length - 1) clearTimeout(timer);
        $('#end').html(status.oper_end);

        var container = $('#status');
        // TODO 这里调整下交互，这么实现恶心了。。
        var bar = $('.bar', container);
        var message = $('.message', container);
        var html = '<ol>';
        statuses.forEach(function(status) {
          html += '<li>' + status + '</li>';
        });
        message.html(html + '</ol>');
        var queue = $('ol li', el);

        bar.width((status.status + 1) * el.data('max') / statuses.length);
        for (var i = 0, l = status.status + 1; i < l; i++) {
          $(queue[i]).addClass('done');
          $(queue[i]).html(statuses[i] + ' <strong>&#8730;</strong>');
        }
      });
    }, 1000);
  };
});
