'use strict';

var addr = 'http://localhost:1506/api/pictures?callback=__jsonpCallback';
window.pictures = null;

var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('template');
var filtersBloc = document.querySelector('.filters');
filtersBloc.classList.add('hidden');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

/** @constant {number} */
var IMAGE_LOAD_TIMEOUT = 10000;

/**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
var getPictureElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  container.appendChild(element);
  var _picture = new Image();
  var _pictureTimeout;
  _picture.onload = function(evt) {
    clearTimeout(_pictureTimeout);
    element.querySelector('img').src = evt.target.src;
    _picture.width = '182';
    _picture.height = '182';
  };
  _picture.onerror = function() {
    element.classList.add('picture-load-failure');
  };
  _picture.src = data.url;
  _pictureTimeout = setTimeout(function() {
    _picture.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);
  return element;
};

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
  arr.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
}

loadAndCreate(addr, somethingDoWithPicturesCallback2);
