var Wishable = Wishable || {
  initialized:      false,
  cordova_present:  (typeof window.cordova != 'undefined'),

  init:   function init($, $context) {
    $('#create-wish-form').validate({
      submitHandler: function(form) {
        var params = $(form).formParams();
        Wishable.api.create_wish(params, function(data) {
          if (data) {
            alert('your wish has been created');
          }
        });
      }
    });

    $('#create-account-form').validate({
      submitHandler: function(form) {
        var params = $(form).formParams();
        Wishable.api.register_user(params, function(data) {
          if (data) {
            alert('your account has been created');
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
        });
      }
    });

    $('#donate-form').validate({
      submitHandler: function(form) {
        var params = $(form).formParams();
        Wishable.api.donate(params, function(data) {
          if (data) {
            alert('your donation will be processed');
          }
        });
      }
    });

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

};

(function($) {
  $(document).on('pageshow', function(e, ui) {
    var $page = $(e.target);

    // if this is an object, we're interested
    if (typeof($page) == 'object') {
      // insert the top menu as necessary
      Wishable.unprocessed('.top-menu', $page).each(function() {
        Wishable.load_template($(this), '#top-menu');
      });

      if ($page.attr('id') == 'wishes') {
        Wishable.wishes.index();
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
