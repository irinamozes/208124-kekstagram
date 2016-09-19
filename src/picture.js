
'use strict';
var Gallery = require('./gallery');
var gallery = new Gallery();
var addr = 'http://localhost:1506/';
var elementToClone;

var templateElement = document.querySelector('template');

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

var getPictureElement = function(data) {
  var element = elementToClone.cloneNode(true);
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

  _picture.src = 'http://localhost:1506/' + data.url;

  _pictureTimeout = setTimeout(function() {

    _picture.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);
  return element;
};

var Picture = function(data) {
  this.data = data;
  this.element = getPictureElement(data);

  this.pictureClick = this.pictureClick.bind(this);

  this.element.addEventListener('click', this.pictureClick);

};


Picture.prototype.pictureClick = function(evt) {
  var target = evt.target;
  if (target.tagName !== 'IMG') {
    return;
  } else {
    window._src = target.src;
    evt.preventDefault();
    location.hash = '#photo/' + window._src.replace(addr, '');
    gallery.show(window._src);
  }
};


Picture.prototype.remove = function() {
  this.element.removeEventListener('click', this.pictureClick);
};


module.exports = Picture;
