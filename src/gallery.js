'use strict';
//var _src;
var renderedPicture = [];
var like = 0;
var comments = 0;
var fhotoGallery = document.querySelector('.gallery-overlay');
var imageGallery = document.querySelector('.gallery-overlay-image');
var likesCount = document.querySelector('.likes-count');
var commentsCount = document.querySelector('.comments-count');

var Gallery = function() {
  var self = this;
  this.closeGallery = document.querySelector('.gallery-overlay-close');
  this.closeGallery.onclick = function() {
    self.hide();
  };

  var urlPictures = self.urlPictures;

  imageGallery.onclick = function() {
    self.setActivePicture(urlPictures);
  };

  likesCount.onclick = function() {
    self.likesCountImage();
  };

  commentsCount.onclick = function() {
    self.commentsCountImage();
  };

};


Gallery.prototype.show = function(__src__) {
  fhotoGallery.classList.remove('invisible');
  imageGallery.src = __src__;
  return __src__;
};


Gallery.prototype.hide = function() {
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

  var addr = 'http://localhost:1506/';


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

module.exports = Gallery;
