var Wishable = Wishable || {
  initialized:  false,

  init:   function init() {

  }
};

(function($) {
  $(document).on('pageshow', function(e, ui) {
    var $page = $(e.target);

    // if this is an object, we're interested
    if (typeof($page) == 'object') {
      if ($page.attr('id') == 'wishes') {
        Wishable.wishes.index();
      }
    }
  });
})(jQuery);
