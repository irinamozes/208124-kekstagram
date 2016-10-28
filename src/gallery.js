'use strict';
var picturesContainer = document.querySelector('.pictures');
var n = 0;
var renderedPicture = [];
var like = 0;
var comments = 0;
var fhotoGallery = document.querySelector('.gallery-overlay');
var imageGallery = document.querySelector('.gallery-overlay-image');
var likesCount = document.querySelector('.likes-count');
var commentsWord = document.querySelector('.gallery-overlay-controls-comments');
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
  commentsWord.addEventListener('click', this.commentsCountImage);
  window.addEventListener('hashchange', this.onchangeLocHash.bind(this));
};


Gallery.prototype.show = function(__src__, datLikes, datComments) {
  fhotoGallery.classList.remove('invisible');
  imageGallery.src = __src__;

  likesCount.textContent = datLikes;
  commentsCount.textContent = datComments;

  return __src__;
};

Gallery.prototype.hide = function() {
  location.hash = '';
  renderedPicture = [];
  fhotoGallery.classList.add('invisible');

};

Gallery.prototype.hideCount = function() {
  like = 0;
  likesCount.textContent = like;
  comments = 0;
  commentsCount.textContent = comments;
};

Gallery.prototype.setActivePicture = function() {

  imageGallery.src = '';

  var notFailureList = Array.prototype.slice.call(document.querySelectorAll('.picture'));

  var k = 0;
  for (var l = 0; l < notFailureList.length; l++) {
    if (notFailureList[l].querySelector('img').src !== addr) {
      renderedPicture[k] = notFailureList[l].querySelector('img').src;
      k = k + 1;
    }
  }
  n = 0;

  var __src = window._src; //предыдущее

  n = renderedPicture.indexOf(__src);
  n = n + 1;
  if (n > renderedPicture.length - 1) {
    n = 0;
  }
  window._src = renderedPicture[n];
  location.hash = 'photo/' + window._src.replace(addr, '');

  //Передача лайков и комментов с маленького фото на большое
  var pictureSmallLike = picturesContainer.childNodes[n + 1].querySelector('.picture-likes');
  likesCount.textContent = pictureSmallLike.textContent;
  var pictureSmallComment = picturesContainer.childNodes[n + 1].querySelector('.picture-comments');
  commentsCount.textContent = pictureSmallComment.textContent;

  imageGallery.src = window._src;
  return renderedPicture;
};

Gallery.prototype.likesCountImage = function() {

  like = 1;
  likesCount.textContent = Number(likesCount.textContent) + like;

  var notFailureList = Array.prototype.slice.call(document.querySelectorAll('.picture'));
  var k = 0;
  for (var l = 0; l < notFailureList.length; l++) {
    if (notFailureList[l].querySelector('img').src !== addr) {
      renderedPicture[k] = notFailureList[l].querySelector('img').src;
      k = k + 1;
    }
  }
  var srcPict = addr + location.hash.substring(7);

  var m = renderedPicture.indexOf(srcPict);

  var pictureSmall = picturesContainer.childNodes;
  if (pictureSmall.length > renderedPicture.length) {
    m = m + 1;
  }

  var pictureSmallLike = picturesContainer.childNodes[m].querySelector('.picture-likes');

  pictureSmallLike.textContent = Number(likesCount.textContent);

};

Gallery.prototype.commentsCountImage = function() {
  comments = 1;
  commentsCount.textContent = Number(commentsCount.textContent) + comments;

  var srcPict = addr + location.hash.substring(7);

  var notFailureList = Array.prototype.slice.call(document.querySelectorAll('.picture'));
  var k = 0;
  for (var l = 0; l < notFailureList.length; l++) {
    if (notFailureList[l].querySelector('img').src !== addr) {
      renderedPicture[k] = notFailureList[l].querySelector('img').src;
      k = k + 1;
    }
  }

  var m = renderedPicture.indexOf(srcPict);
  var pictureSmall = picturesContainer.childNodes;

  console.log(pictureSmall);
  if (pictureSmall.length > renderedPicture.length) {
    m = m + 1;
  }

  var pictureSmallComment = picturesContainer.childNodes[m].querySelector('.picture-comments');
  pictureSmallComment.textContent = commentsCount.textContent;
};


Gallery.prototype.onchangeLocHash = function() {
  var hash = location.hash.match(/#photo\/(\S+)/);

  if (hash) {
    Gallery.prototype.show(addr + hash[1], likesCount.textContent, commentsCount.textContent);
  }
};

module.exports = Gallery;
