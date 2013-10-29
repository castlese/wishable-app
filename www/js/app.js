var Wishable = Wishable || {
  initialized:      false,
  cordova_present:  (typeof window.cordova != 'undefined'),
  page_params:      {},

  init:   function init($, $context) {
    if (Wishable.cordova_present) {
      $('body').addClass('cordova');
    }
    else {
      $('body').addClass('webapp');
    }

  //   $( "#login-password" ).rules( "add", {
  //     required: true,
  //     minlength: 8,
  //     messages: {
  //       required: "Please enter a password",
  //       minlength: jQuery.format("Please set a password with at least 8 characters")
  //     }
  // });

    $('#create-wish-form').validate({
      submitHandler: function(form) {
        var params = $(form).formParams();
        Wishable.api.create_wish(params, function(data) {
          if (data) {
            Wishable.change_page('#wish', {wish_id: data.id});
          }
          else {
            Wishable.show_last_error();
          }
        });
      }
    });

    $('#create-account-form').validate({
      rules: {
      password:{
           minlength: 8
        }
      },
      submitHandler: function(form) {
        var params = $(form).formParams();
        Wishable.api.register_user(params, function(data) {
          if (data) {
            alert('your account has been created');
          }
          else {
            Wishable.show_last_error();
          }
        });
      }
    });

    $('#login-form').validate({
      submitHandler: function(form) {
        var params = $(form).formParams();
        Wishable.api.login(params, function(data) {
          if (data) {
            alert('you have logged in');
          }
          else {
            Wishable.show_last_error();
          }
        });
      }
    });

    $('#donate-form').validate({
      submitHandler: function(form) {
        var params = $(form).formParams();
        Wishable.api.donate(params, function(data) {
          if (data) {
            alert('your donation will be proccessed');
          }
        });
      }
    });

    if (!Wishable.cordova_present) {
      $('.page-content').niceScroll();
    }

    Wishable.initialized = true;
  },

  unprocessed: function unprocessed(selector, $context, label) {
    var test = 'wishable-processed';
    if (label) {
      test += '-' + label;
    }

    var $el = $(selector + ':not(.' + test  + ')', $context);
    $el.addClass(test);

    return $el;
  },

  load_template: function load_template($el, template, values) {
    $el.loadTemplate(template, values);
    $el.trigger('create');
  },

  show_last_error: function show_last_error() {
    if (Wishable.api.last_error) {
      alert(Wishable.api.last_error);
    }
  },

  query_value: function query_value(name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);

    if (!results) {
      return null;
    }
    return results[1] || null;
  },

  change_page: function change_page(to_page, params, opts) {
    Wishable.page_params = params || {};
    $.mobile.changePage(to_page, opts);
  },

  pickup_param: function pickup_param(name) {
    var from_query = Wishable.query_value(name);
    return from_query || Wishable.page_params[name];
  },

  wait: function wait(start_or_stop, message, text_only) {
    var hide = (start_or_stop == 'stop');

    if (hide) {
      $.mobile.loading("hide");
    }
    else {
      var show_text = false;
      if (message) {
        show_text = true;
      }

      $.mobile.loading("show", {
        text:         message,
        textVisible:  show_text,
        textonly:     text_only
      });
    }
  }
};

(function($) {
  $(document).on('pageshow', function(e, ui) {
    var $page = $(e.target);

    // if this is an object, we're interested
    if (typeof($page) == 'object') {
      // insert the top menu as necessary
      Wishable.unprocessed('.top-menu', $page).each(function() {
        var $top_menu = $(this);
        Wishable.load_template($top_menu, '#top-menu');

        $top_menu.find('.top-menu-content').hide();
        $top_menu.find('.top-menu-toggle').click(function(e) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          e.preventDefault();

          $top_menu.find('.top-menu-content').toggle();

          if ($top_menu.find('.top-menu-content:visible').length > 0) {
            $top_menu.find('.top-menu-toggle').html('close');
            $top_menu.addClass('expanded');

            $('body').on('click.top-menu', function() {
              $top_menu.find('.top-menu-toggle').click();
            });
          }
          else {
            $top_menu.find('.top-menu-toggle').html('menu');
            $top_menu.removeClass('expanded');

            $('body').off('click.top-menu');
          }
        });
      });

      if ($page.attr('id') == 'wish') {
        Wishable.wishes.show(Wishable.pickup_param('wish_id'));
      }

      if ($page.attr('id') == 'wishes') {
        Wishable.wishes.index();
      }

      if ($page.attr('id') == 'my-wishes') {
        Wishable.wishes.my_wishes();
      }

      if ($page.attr('id') == 'donate') {
        Wishable.donations.donate(Wishable.pickup_param('wish_id'));
      }
    }
  });

  /**
   *
   * Place handlers for when the document has been loaded here.
   *
   */
  if (Wishable.cordova_present) {
    // deviceready is not reliably firing on Android, though it seems
    // Cordova is running correctly, so check in after 2 seconds and initialize
    // without the deviceready event if Temptster hasn't already been initialized
    document.addEventListener('deviceready', function() {
      FastClick.attach(document.body);
    }, false);

    // Device event handlers
    document.addEventListener('resume', function() {
    });

    document.addEventListener('pause', function() {
    });

    document.addEventListener("menubutton", function() {
    }, false);

    document.addEventListener("online", function() {
    }, false);

    document.addEventListener("offline", function() {
    }, false);
  }
  else {
    // we're in a browser, so Build has not provided the JS files for FB.
    $(document).ready(function() {
      Wishable.init($, $(document));
    });
  }

})(jQuery);
