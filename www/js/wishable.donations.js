/* global $, Wishable */
"use strict";

Wishable.donations = Wishable.donations || {

  donate: function donate(wish_id) {
    Wishable.wait('start', "Getting wish details");
    Wishable.api.wish(wish_id, function(wish) {
      Wishable.wait('stop');

      if (!wish) {
        return;
      }

      var $donate_div = $('#donate .region.region-main-content');
      $donate_div.html('<div class="donation" />');

      wish.wish_title = "You're funding <span>" + wish.title + "</span>";
      wish.percent_of_goal = Wishable.wishes.percent_fulfilled(wish);

      var $form = $donate_div.find('.donation');
      Wishable.load_template($form, '#create-donation', wish);

      var $summary_div = $form.find('.wish-details');
      Wishable.wishes.show_summary($summary_div, wish);
    });
  }
};
