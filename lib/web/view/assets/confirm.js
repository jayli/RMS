// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布确认.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

define(function(require) {
  var $ = require('jquery');
  var _ = require('underscore');

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
    var oper = btn.parent();
    var publist = [];
    $('input.publish[type="checkbox"]').each(function(idx, item) {
      item = $(item);
      item[0].checked && publist.push({
        name: item.data('path')
      , app: oper.data('appname')
      , revision: item.data('revision')
      });
    });

    if (_(publist).isEmpty()) {
      publist = [{
        name: oper.data('filename')
      , app: oper.data('appname')
      , revision: oper.data('revision')
      }];
    }

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
