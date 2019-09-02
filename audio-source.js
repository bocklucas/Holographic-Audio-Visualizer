// audio-source.js

exports.AudioLoader = function() {
    this.errorMessage = "";

    this.loadStream = function(successCallback) {
        successCallback();
    };
};