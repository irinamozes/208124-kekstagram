'use strict';

var addr = 'http://localhost:1506/api/pictures?callback=__jsonpCallback';
window.pictures = null;

var picturesContainer = document.querySelector('.pictures');
var filtersBloc = document.querySelector('.filters');
filtersBloc.classList.add('hidden');


var loadAndCreate = require('./load');

var getPictureElement = require('./picture');

var renderPicturesCallback2 = function(arr) {
  arr.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};

loadAndCreate(addr, renderPicturesCallback2);
