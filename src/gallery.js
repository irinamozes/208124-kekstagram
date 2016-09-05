'use strict';
var _src;
var renderedPicture = [];
var like = 0;
var comments = 0;
var fhotoGallery = document.querySelector('.gallery-overlay');
var imageGallery = document.querySelector('.gallery-overlay-image');
var likesCount = document.querySelector('.likes-count');
var commentsCount = document.querySelector('.comments-count');

var Gallery = function(data) {
  var self = this;
  this.urlPictures = this.setPictures(data);
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

Gallery.prototype.setPictures = function(data) {
  var srcList = [];
  for ( var i = 0; i <= data.length - 1; i++) {
    srcList[i] = data[i].url;
  }

  return srcList;
};


Gallery.prototype.show = function(__src) {
  fhotoGallery.classList.remove('invisible');
  imageGallery.src = __src;
};

Gallery.prototype.pictureClick = function(evt) {
  var target = evt.target;
  if (target.tagName !== 'IMG') {
    return;
  } else {
    _src = target.src;
    Gallery.prototype.show(_src);
  }
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

  notFailureList.forEach(function(image, k) {
    renderedPicture[k] = image.querySelector('img').src;
  });

  var i;

  var __src = _src; //предыдущее
  i = renderedPicture.indexOf(__src);
  i = i + 1;

  if (renderedPicture[i] === addr) {
    i = i + 1;
  }
  if (i > renderedPicture.length - 1) {
    i = 0;
  }
  _src = renderedPicture[i];

  imageGallery.src = _src;
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
