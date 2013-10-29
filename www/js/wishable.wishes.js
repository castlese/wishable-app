/* global $, Wishable */
"use strict";

Wishable.wishes = Wishable.wishes || {
  index: function index() {
    Wishable.api.wishes(function(wishes) {
      var i;
      for (i = 0; i < wishes.length; i++) {
        Wishable.wishes.show_summary($('#wish-list'), wishes[i]);
      }
    });
  },

  show_summary: function($el, wish) {
    wish.percent_of_goal = Wishable.wishes.percent_fulfilled(wish);

    wish['user_name'] = (wish.user.email || wish.user.name) + " wishes for";

    var $wrapper = $('<div class="wish-summary-wrapper" />');
    Wishable.load_template($wrapper, '#wish-summary', wish);

    $wrapper.find('.action').click(function(e) {
      Wishable.change_page('#donate', {wish_id: wish.id});
    });

    if (wish.user.url) {
      $wrapper.find('.wish-user-image').append('<img src="' + wish.user.url + '" />');
    }

    $el.append($wrapper);
  },

  my_wishes: function my_wishes() {
    // Wishable.unprocessed('#add-video').click(function(e) {
    //   e.preventDefault();

    //   Wishable.capture.capture_video(1, function(success) {
    //     if (success) {
    //     }
    //     else {
    //     }
    //   });
    // });
  },

  percent_fulfilled: function percent_fulfilled(wish) {
    return wish.donated ? wish.donated + " (" + (wish.cost / wish.donated * 100) + '%)' : '0%';
  },

  show: function show(wish_id) {
    Wishable.wait('start', 'loading wish');
    Wishable.api.wish(wish_id, function(data) {
      Wishable.wait('stop');

      if (!data) {
        return;
      }

      data['user.name'] = data.user.email || data.user.name;

      var $wish_div = $('#wish .region.region-main-content');
      $wish_div.html("<div class='wish-display' />");
      Wishable.load_template($wish_div.find('.wish-display'), '#wish-page', data);

      if (data.user.url) {
        $wish_div.find('.wish-user-image').append('<img src="' + data.user.url + '" />');
      }

      $wish_div.find('.action').click(function(e) {
        Wishable.change_page('#donate', {wish_id: wish_id});
      });
    });
  }
};
