'use strict';

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
module.exports = function(data, container) {
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
