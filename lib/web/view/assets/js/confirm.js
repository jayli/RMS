// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布确认.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

define(function(require) {
  var $ = require('jquery');
  var _ = require('underscore');
  var mustache = require('mustache').to_html;

  require('./bootstrap-modal')($);

  var template;
  function toggle(data, obj) {
    $('#modal').html(mustache(data, obj));
    $('#confirm').modal({
      backdrop: true
    , keyboard: true
    });
    $('#confirm').modal('toggle');
  }

  var compressor = [{
    id: 'uglifyjs'
  , name: 'UglifyJS'
  }, {
    id: 'jsmin',
    name: 'JSMin'
  }];

  var pubtypes = [];
  $('#pubtype option').each(function(idx, opt) {
    opt = $(opt);
    pubtypes.push({
      primary: idx === 0 ? 'primary' : ''
    , type: opt.val()
    , text: opt.text()
    });
  });

  // 这段属于纯粹的前端模版
  $('#pubtype').parent().html(mustache(
      '{{#pubtypes}}<button class="btn {{primary}}"' +
      ' data-type="{{type}}">{{text}}</button>{{/pubtypes}}'
    , {pubtypes: pubtypes}
  ));

  $('#pubbtns .btn').click(function(e) {
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
      , revision: oper.data('revision')
      }];
    }

    var obj = {
      pubtype: btn.data('type')
    , pubtext: btn.html()
    , 'apptype-href': oper.data('apptype')
    , 'app-name': oper.data('appname')
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
