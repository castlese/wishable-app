Wishable.wishes = Wishable.wishes || {
  index: function index() {
    Wishable.api.wishes(function(data) {
      $('#wish-list').append("<div>hello world</div>");
    });
  }
};
