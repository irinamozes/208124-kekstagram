'use strict';

var addr = 'http://localhost:1506/api/pictures?callback=__jsonpCallback';

var picturesContainer = document.querySelector('.pictures');
var filtersBloc = document.querySelector('.filters');
filtersBloc.classList.add('hidden');

var loadAndCreate = require('./load');

var Picture = require('./picture');

var Gallery = require('./gallery');

var renderPicturesCallback2 = function(arr) {
  var picture = new Picture(arr, picturesContainer);
  arr.forEach(function(pictur) {
    picture.getPictureElement(pictur, picturesContainer);
  });

};

var startGalleryCallback3 = function(arr) {
  var gallery = new Gallery(arr);

  picturesContainer.addEventListener('click', gallery.pictureClick);

};

loadAndCreate(addr, renderPicturesCallback2, startGalleryCallback3);
