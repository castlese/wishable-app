/* global $, Wishable */
"use strict";

Wishable.wishes = Wishable.wishes || {
  index: function index() {
    Wishable.api.wishes(function(data) {
      $('#wish-list').append("<div>hello world</div>");
    });
  },

  show: function show(wish_id) {
    Wishable.wait('start', 'loading wish');
    Wishable.api.wish(wish_id, function(data) {
      data['user.name'] = data.user.email;

      Wishable.load_template($.mobile.activePage.find('.region-main-content'), '#show-wish', data);
    });
  }
};
