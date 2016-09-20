'use strict';
var renderedPicture = [];
var like = 0;
var comments = 0;
var fhotoGallery = document.querySelector('.gallery-overlay');
var imageGallery = document.querySelector('.gallery-overlay-image');
var likesCount = document.querySelector('.likes-count');
var commentsCount = document.querySelector('.comments-count');
var addr = 'http://localhost:1506/';

var Gallery = function() {

  this.closeGallery = document.querySelector('.gallery-overlay-close');

  this.hide = this.hide.bind(this);
  this.setActivePicture = this.setActivePicture.bind(this);
  this.likesCountImage = this.likesCountImage.bind(this);
  this.commentsCountImage = this.commentsCountImage.bind(this);

  this.closeGallery.addEventListener('click', this.hide);

  imageGallery.addEventListener('click', this.setActivePicture);

  likesCount.addEventListener('click', this.likesCountImage);

  commentsCount.addEventListener('click', this.commentsCountImage);

  window.addEventListener('hashchange', this.onchangeLocHash.bind(this));
};


Gallery.prototype.show = function(__src__) {
  fhotoGallery.classList.remove('invisible');
  imageGallery.src = __src__;
  return __src__;
};

Gallery.prototype.hide = function() {
  location.hash = '';
  fhotoGallery.classList.add('invisible');
  Gallery.prototype.hideCount();
};

Gallery.prototype.hideCount = function() {
  like = 0;
  likesCount.textContent = like;
  comments = 0;
  commentsCount.textContent = comments;
};

Gallery.prototype.setActivePicture = function() {

  Gallery.prototype.hideCount();

  imageGallery.src = '';

  var notFailureList = Array.prototype.slice.call(document.querySelectorAll('.picture'));

  var k = 0;
  for (var l = 0; l < notFailureList.length; l++) {
    if (notFailureList[l].querySelector('img').src !== addr) {
      renderedPicture[k] = notFailureList[l].querySelector('img').src;
      k = k + 1;
    }
  }
  var n = 0;

  var __src = window._src; //предыдущее

  n = renderedPicture.indexOf(__src);
  n = n + 1;
  if (n > renderedPicture.length - 1) {
    n = 0;
  }
  window._src = renderedPicture[n];
  location.hash = 'photo/' + window._src.replace(addr, '');
  imageGallery.src = window._src;

};

Gallery.prototype.likesCountImage = function() {
  like = like + 1;
  likesCount.textContent = like;
};

Gallery.prototype.commentsCountImage = function() {
  comments = comments + 1;
  commentsCount.textContent = comments;
};


Gallery.prototype.onchangeLocHash = function() {
  var hash = location.hash.match(/#photo\/(\S+)/);
  if (hash) {
    Gallery.prototype.show(addr + hash[1]);
  }
};

module.exports = Gallery;
