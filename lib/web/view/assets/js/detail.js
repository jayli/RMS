// vim: set sw=2 ts=2:

/**
 * @fileoverview 发布detail.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

define(function(require) {
  var $ = require('jquery');
  var _ = require('underscore');

  $('.publish').prop('checked', false);

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
