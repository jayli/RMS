// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Frontend.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

(function() {
    // config
    var path = 'http://a.tbcdn.cn/libs/',
        alias = {
          'jquery' : 'jquery/1.6.2/jquery',
          'mustache' : 'mustache/0.3.1/mustache',
          'underscore' : 'underscore/1.1.6/underscore',
          'backbone' : 'backbone/0.5.2/backbone',
          'less': '/assets/less-1.1.3.min.js'
        };

    // add prefix
    for (var k in alias) {
      if (!/^\//.test(alias[k])) {
        alias[k] = path + alias[k];
      }
    }

    seajs.config({
      alias: alias,
      map: [
        [/^(.*\.(?:css|js))(?:.*)$/i, '$1?t=' + (+new Date())]
      ]
    });
})();

define(function(require) {
  require('less');
  var $ = require('jquery');
  var _ = require('underscore');

  // dropdown
  $('body').click(function(e) {
    $('.dropdown').removeClass('open');
  });
  $('.dropdown-toggle').click(function(e) {
    e.preventDefault();
    $(this).parent('.dropdown').toggleClass('open');
    return false;
  });

  $('.alert-message .close').click(function(e) {
    e.preventDefault();
    $(this).parent('.alert-message').remove();
  });

  require.async('./prettify', function(prettify) {
    var len = $('.prettyprint').text().length;
    // 高亮大文件的时候有点卡
    if (len < 100000) {
      setTimeout(function() {
        prettify();
      }, 100);
    }
  });

  $(document.body).css('opacity', '1');

  require('./confirm');

  if ($('#processbar')[0]) {
    require.async('./publish', function(publish) {
      publish.init($('#processbar'));
    });
  }

  $('.select-all').click(function() {
    $('.publish')
      .prop('checked', this.checked)
      .parents('tr')
      [this.checked ? 'addClass' : 'removeClass']('active');
  });

  function allSelected() {
    return _($('.publish')).all(function(item) {
      return item.checked;
    });
  }

  $('#directory tbody tr').click(function(e) {
    if (e.target.tagName === 'A') return;
    var tr = $(this);
    tr.toggleClass('active');
    if (e.target.tagName !== 'INPUT') {
      $('.publish', tr).prop('checked', !$('.publish', tr)[0].checked);
    }
    $('.select-all').prop('checked', $('.publish', tr).prop('checked') && allSelected());
  });

});
