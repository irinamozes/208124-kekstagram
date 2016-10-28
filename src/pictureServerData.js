'use strict';
var likesCount = document.querySelector('.likes-count');

var PictureData = function(picture) {
  this.likes = picture.likes;
  //this.likeState = false;
  this.comments = picture.comments;
  this.pictureUrl = picture.url;
  this.onOverlayClick = this.onOverlayClick.bind(this);
  this.setLikesCount = this.setLikesCount.bind(this);
};

PictureData.prototype.onOverlayClick = function(elemLikesCount) {
  likesCount.addEventListener('click', this.setLikesCount(elemLikesCount));

};

PictureData.prototype.setLikesCount = function() {
  var like = 1;
  likesCount.textContent = Number(likesCount.textContent) + like;
};

module.exports = PictureData;
