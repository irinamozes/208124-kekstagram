'use strict';

var addr = 'http://localhost:1506/api/pictures?callback=__jsonpCallback';
window.pictures = null;

var loadAndCreate = function(addres, callback2) {
  var scriptOld = document.body.getElementsByTagName('script');

  window.__jsonpCallback = function(data) {
    window.pictures = data;
    callback2(window.pictures);
  };

  var scriptEl = document.createElement('script');
  scriptEl.src = addres;
  document.body.insertBefore(scriptEl, scriptOld[0]);
};


function somethingDoWithPicturesCallback2(arr) {
  var urlphotos = [];
  for (var i = 0; i < arr.length; i++) {
    urlphotos[i] = window.pictures[i].url;
  }
}

loadAndCreate(addr, somethingDoWithPicturesCallback2);
