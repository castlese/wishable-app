Wishable.api = Wishable.api || {
  user_token:   "",
  last_error:   null,

  /**
   * Get a list of the latest wishes
   *
   * @method wishes
   * @param  {Function} callback Callback to receive the data
   */
  wishes: function(callback) {
    Wishable.api.get('wishes', null, null, function(data) {
      callback(data);
    });
  },

  /**
   *
   * GET some data from the server.
   *
   * @method get
   * @param {String} url
   * @param {Object} data
   * @param {Object} page
   * @param {Function} callback A function to pass the returned data to.  This function
   *   will receive one parameter, which is the result from the server.  If the parameter
   *   is null, check client.error() for information.
   * @returns {Boolean} true if the request was sent.  This does not mean the request was succesful,
   *   only that it was actually sent to the server.
   */
  get: function get(uri, data, page, callback) {
    if (typeof callback === 'undefined') {
      callback = page;
      page = null;
    }

    return this.request('GET', uri, data, page, callback);
  },

  /**
   *
   * POST some data to the server.
   *
   * @method post
   * @param {String} url
   * @param {Object} data
   * @param {Object} page
   * @param {Function} callback A function to pass the returned data to.  This function
   *   will receive one parameter, which is the result from the server.  If the parameter
   *   is null, check client.error() for information.
   * @returns {Boolean} true if the request was sent.  This does not mean the request was succesful,
   *   only that it was actually sent to the server.
   */
  post: function post(uri, data, page, callback) {
    if (typeof callback === 'undefined') {
      callback = page;
      page = null;
    }

    return this.request('POST', uri, data, page, callback);
  },

  /**
   *
   * PUT some data to the server.
   *
   * @method put
   * @param {String} url
   * @param {Object} data
   * @param {Object} page
   * @param {Function} callback A function to pass the returned data to.  This function
   *   will receive one parameter, which is the result from the server.  If the parameter
   *   is null, check client.error() for information.
   * @returns {Boolean} true if the request was sent.  This does not mean the request was succesful,
   *   only that it was actually sent to the server.
   */
  put: function put(uri, data, page, callback) {
    if (typeof callback === 'undefined') {
      callback = page;
      page = null;
    }

    return this.request('PUT', uri, data, page, callback);
  },

  /**
   *
   * DELETE some data to the server.
   *
   * @method delete
   * @param {String} url
   * @param {Object} data
   * @param {Object} page
   * @param {Function} callback A function to pass the returned data to.  This function
   *   will receive one parameter, which is the result from the server.  If the parameter
   *   is null, check client.error() for information.
   * @returns {Boolean} true if the request was sent.  This does not mean the request was succesful,
   *   only that it was actually sent to the server.
  */
  'delete': function (uri, data, page, callback) {
     if (typeof callback === 'undefined') {
      callback = page;
      page = null;
    }

   return this.request('DELETE', uri, data, null, callback);
  },

  /**
   *
   * Workhorse function for get(), post(), put() and delete(), which are just wrappers for this
   * function.
   *
   *
   * @method request
   * @param {String} method
   * @param {String} url
   * @param {Object} data
   * @param {Object} page
   * @param {Function} callback A function to pass the returned data to.  This function
   *   will receive one parameter, which is the result from the server.  If the parameter
   *   is null, check client.error() for information.
   * @returns {Boolean} true if the request was sent.  This does not mean the request was succesful,
   *   only that it was actually sent to the server.
   */
  request: function request(method, uri, data, page, callback) {
    Wishable.api.last_error = null;

    if (!jQuery) {
      console.log("Can't find jQuery!");
      return false;
    }

    var payload = data || {};
    if (Wishable.api.user_token) {
      payload.auth_token = Wishable.api.user_token;
    }

    var ajax_payload = {
      beforeSend: function(xhr) {
        if (method != 'GET' && method != 'POST') {
          xhr.setRequestHeader("X-Http-Method-Override", method);
        }
      },
      contentType: "application/json",
      type:         method,
      url:          'http://wishable-production.herokuapp.com/v1/' + uri
    };

    if (page) {
      payload.page = page.page;
      payload.per_page = page.per_page;
    }

    if (payload) {
      ajax_payload.data = (method == 'GET')? payload : JSON.stringify(payload);
    }

    jQuery.ajax(ajax_payload)
      .fail(function(jqXHR, status, e) {
        var default_message = "There was an error making this request.";

        var response = {message: default_message};

        if (status == 'timeout') {
          response.message = "Could not connect.  Is your internet connection working?";
        }
        else if (status == 'abort') {
          // do nothing
          return;
        }
        else if (status == 'parsererror') {
          response.message = "Could not read the response from the server.";
        }
        else if (status == 'error') {
          if (jqXHR.responseText) {
            response = JSON.parse(jqXHR.responseText);
          }
        }
        else {
          response.message = "Unknown error while phoning home.";
        }

        last_error = "Error while trying to make a " + method + " request to " + uri + ": " + response.message;

        callback(null);
      })
      .done(function(data, status, jqXHR) {
        callback(data);
      });

    return true;
  },
};
