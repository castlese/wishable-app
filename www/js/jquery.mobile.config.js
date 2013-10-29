$(document).bind("mobileinit", function(){
  $.mobile.defaultPageTransition = 'none';

  // as per http://view.jquerymobile.com/1.3.1/dist/demos/faq/how-configure-phonegap-cordova.html
  $.support.cors = true;
  $.mobile.allowCrossDomainPages = true;
  $.mobile.pushStateEnabled = false;
  $.mobile.phonegapNavigationEnabled = true;
});

