/* global $, Wishable */
"use strict";

Wishable.wishes = Wishable.wishes || {
  index: function index() {
    Wishable.api.wishes(function(wishes) {
      var i;
      for (i = 0; i < wishes.length; i++) {
        var wish = wishes[i];

        wish.percent_of_goal = wish.donated ? wish.donated + " (" + (wish.cost / wish.donated * 100) + '%)' : '0%';

        Wishable.load_template($('#wish-list'), '#wish-summary', wish);
      }
    });
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
    });
  }
};
