
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


var Picture = function(data, container) {
  //var self = this;
  this.data = data;
  this.element = this.getPictureElement(this.data, container);

};

Picture.prototype.getPictureElement = function(dat, cont) {
  var element = elementToClone.cloneNode(true);
  cont.appendChild(element);
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

  _picture.src = 'http://localhost:1506/' + dat.url;

  _pictureTimeout = setTimeout(function() {

    _picture.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);
  return element;
};

  //var quizYes = this.element.querySelector('.review-quiz-answer-yes');
  //var quizNo = this.element.querySelector('.review-quiz-answer-no');

  //this.clickYes = function() {
    //quizNo.classList.remove('review-quiz-answer-active');
    //quizYes.classList.add('review-quiz-answer-active');
  //};
  //this.clickNo = function() {
    //quizYes.classList.remove('review-quiz-answer-active');
    //quizNo.classList.add('review-quiz-answer-active');
  //};

  //this.remove = function() {
    //quizYes.removeEventListener('click', this.clickYes);
    //quizNo.removeEventListener('click', this.clickNo);
    //this.element.parentNode.removeChild(this.element);
  //};

  //quizYes.addEventListener('click', this.clickYes);
  //quizNo.addEventListener('click', this.clickNo);
  //container.appendChild(this.element);



module.exports = Picture;
