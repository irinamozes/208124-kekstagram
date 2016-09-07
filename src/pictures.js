'use strict';

var addr = 'http://localhost:1506/api/pictures?callback=__jsonpCallback';

var picturesContainer = document.querySelector('.pictures');
var filtersBloc = document.querySelector('.filters');
filtersBloc.classList.add('hidden');

var loadAndCreate = require('./load');

var Picture = require('./picture');

var renderPicturesCallback2 = function(arr) {
  arr.forEach(function(picture) {
    picturesContainer.appendChild(new Picture(picture).element);
  });

};

loadAndCreate(addr, renderPicturesCallback2);
