/* global $, Wishable, FileTransfer */
"use strict";

Wishable.capture = Wishable.capture || {
  last_error: '',

  capture_video: function capture_video(wish_id, callback) {
    if (!Wishable.cordova_present) {
      Wishable.capture.last_error = "Cannot capture video on this device";
      callback(null);
    }
    alert('capturing video for wish ' + wish_id);

    function success(files) {
      var file = files[0]; // we only allow one at a time

      var ft   = new FileTransfer();
      var path = file.fullPath;
      var name = file.name;

      ft.upload(path,
        "http://wishable-production.herokuapp.com/v1/wishes/" + wish_id + "/add_video",
        function(result) {
          callback(true);
        },
        function(error) {
          Wishable.capture.last_error = "Error uploading video: " + error.code;
        },
        { fileName: name });
    }

    function error(e) {
      Wishable.capture.last_error  = "Error capturing video: " + e.code;
      callback(null);
    }

    alert('going to call captureVideo');
    navigator.device.capture.captureVideo(success, error, {limit: 1});
  }
};
