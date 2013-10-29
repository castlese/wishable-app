var Wishable = Wishable || {
  initialized:  false,

  init:   function init() {
  	$('#login').validate({
  		submitHandler: function() {
  			Wishable.api.login(form_params);
  		}
  	})
  	$('#create_user').validate({
  		submitHandler: function() {
  			Wishable.api.create_user(form_params);
  		}
  	})
  	$('#create_wish').validate({
  		submitHandler: function() {
  			Wishable.api.create_wish(form_params);
  		}
  	})
  	$('#donate').validate({
  		submitHandler: function() {
  			Wishable.api.donate(form_params);
  		}
  	})
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
