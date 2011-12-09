// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布确认.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

define(function(require) {
  var $ = require('jquery');
  require('./bootstrap-modal')($);

  var template;
  function toggle(data, obj) {
    $('#modal').html(require('mustache').to_html(data, obj));
    $('#confirm').modal({
      backdrop: true
    , keyboard: true
    });
    $('#confirm').modal('toggle');
  }

  var compressor = [{
    id: 'uglifyjs'
  , name: 'UglifyJS'
  }];

  $('.app-oper .btn').click(function(e) {
    e.preventDefault();
    var btn = $(this);
    var publist = [];
    $('input.publish[type="checkbox"]').each(function(idx, item) {
      item.checked && publist.push({
        filename: $(item).data('path')
      , dir: $(item).data('dir')
      });
    });

    var obj = {
      pubtype: btn.html()
    , publist: publist
    , compressor: compressor
    };
    if (template) {
      return toggle(template, obj);
    }

    $.get('/template/confirm', function(data) {
      template = data;
      toggle(template, obj);
    });
  });
});
