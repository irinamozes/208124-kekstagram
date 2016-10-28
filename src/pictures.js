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


var activeFilter = localStorage.getItem('f') || 'filter-popular';

document.querySelector('#' + activeFilter).checked = true;


var pageSize = 12;

var pageNumber = 0;

var pictur;
//var picturData;

var renderPicturesCallback = function(arr) {
  arr.forEach(function(picture) {
    pictur = new Picture(picture).element;
    picturesContainer.appendChild(pictur);
  });

  var event = document.createEvent('Event');
  event.initEvent('hashchange', true, true);
  document.dispatchEvent(event);
};

var renderPicturesCallback2 = function(_length) {
  if (utils.elementIsAtTheBottom(footer) && _length !== 0) {
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
  localStorage.clear();
  localStorage.setItem('f', activeFilter);
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
