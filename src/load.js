'use strict';
var pictures = null;
module.exports = function(addres, callback2, callback3) {
  var scriptOld = document.body.getElementsByTagName('script');

  window.__jsonpCallback = function(data) {
    pictures = data;
    pictures[25].url = 'photos/26.jpg';
    callback2(pictures);
    callback3(pictures);
  };

  var scriptEl = document.createElement('script');
  scriptEl.src = addres;
  document.body.insertBefore(scriptEl, scriptOld[0]);
};
