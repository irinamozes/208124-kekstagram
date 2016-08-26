'use strict';

module.exports = function(addres, callback2) {
  var scriptOld = document.body.getElementsByTagName('script');

  window.__jsonpCallback = function(data) {
    window.pictures = data;
    callback2(window.pictures);
  };

  var scriptEl = document.createElement('script');
  scriptEl.src = addres;
  document.body.insertBefore(scriptEl, scriptOld[0]);
};
