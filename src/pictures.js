'use strict';

var addr = 'http://localhost:1506/api/pictures';

var THROTTLE_TIMEOUT = 100;

var picturesContainer = document.querySelector('.pictures');

var filtersBloc = document.querySelector('.filters');

filtersBloc.classList.remove('hidden');

var footer = document.querySelector('footer');

var loadAndCreate = require('./load');

var Picture = require('./picture');
var utils = require('./utils');

var activeFilter = 'filter-popular';


var pageSize = 12;

var pageNumber = 0;

var pictur;

var renderPicturesCallback = function(arr) {
  arr.forEach(function(picture) {
    pictur = new Picture(picture).element;
    picturesContainer.appendChild(pictur);
  });
};

var renderPicturesCallback2 = function(length) {
  if (utils.elementIsAtTheBottom(footer) && length !== 0) {
    loadPictures(activeFilter, ++pageNumber);
  }
};

var loadPictures = function(filter, currentPageNumber) {
  loadAndCreate(addr, {
    from: currentPageNumber * pageSize,
    to: currentPageNumber * pageSize + pageSize,
    filter: filter
  }, renderPicturesCallback, renderPicturesCallback2);
};

var changeFilter = function(filterID) {
  picturesContainer.innerHTML = '';
  activeFilter = filterID;
  pageNumber = 0;
  loadPictures(filterID, pageNumber);
};

var scrollHandler = utils.throttle(function() {
  if (utils.elementIsAtTheBottom(footer)) {
    loadPictures(activeFilter, ++pageNumber);
  }
}, THROTTLE_TIMEOUT);

window.addEventListener('scroll', scrollHandler);

filtersBloc.addEventListener('click', function(evt) {
  if (evt.target.classList.contains('filters-radio')) {
    changeFilter(evt.target.id);
  }
});

loadPictures(activeFilter, pageNumber);
