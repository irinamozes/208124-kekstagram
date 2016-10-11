
'use strict';
var Gallery = require('./gallery');
var gallery = new Gallery();
var utils = require('./utils');
var BaseComponent = require('./baseComponent');
var PictureData = require('./pictureServerData');


var addr = 'http://localhost:1506/';

var Picture = function(data) {

  this.data = data;

  var IMAGE_LOAD_TIMEOUT = 10000;

  this.templateElement = document.querySelector('#picture-template');

  if ('content' in this.templateElement) {
    this.elementToClone = this.templateElement.content.querySelector('.picture');
  } else {
    this.elementToClone = this.templateElement.querySelector('.picture');
  }

  //this.dataPicture = new PictureData(this.data);

  this.element = this.elementToClone.cloneNode(true);

  this.imageLikes = this.element.querySelector('.picture-likes');
  this.imageComments = this.element.querySelector('.picture-comments');

  BaseComponent.call(this, this.element);

  this.imageElement = this.element.querySelector('img');
  this._picture = new Image();

  this.onPictureLoad = this.onPictureLoad.bind(this);
  this._picture.addEventListener('load', this.onPictureLoad);

  this._picture.src = addr + this.data.url;

  this.onPictureError = this.onPictureError.bind(this);
  this._picture.addEventListener('error', this.onPictureError);

  this.pictureClick = this.pictureClick.bind(this);
  this.element.addEventListener('click', this.pictureClick);

  this._timeout = this._timeout.bind(this);
  this._pictureTimeout = setTimeout(this._timeout, IMAGE_LOAD_TIMEOUT);
};

utils.inherit(Picture, BaseComponent);

Picture.prototype.pictureClick = function(evt) {
  var target = evt.target;
  if (target.tagName !== 'IMG') {
    return;
  } else {
    window._src = target.src;
    evt.preventDefault();
    var dataPicture = new PictureData(this.data);
    location.hash = '#photo/' + window._src.replace(addr, '');
    gallery.show(window._src, dataPicture.likes, dataPicture.comments);
  }
};

Picture.prototype.onPictureLoad = function(evt) {
  clearTimeout(this._pictureTimeout);
  this._picture.src = addr + this.data.url;
  this.imageElement.src = evt.target.src;
  this._picture.width = 182;
  this._picture.height = 182;
  this.imageLikes.textContent = this.data.likes;
  this.imageComments.textContent = this.data.comments;

  this.remove();
};

Picture.prototype.onPictureError = function() {
  clearTimeout(this._pictureTimeout);
  this.element.classList.add('picture-load-failure');
  this.remove();
  BaseComponent.prototype.remove.call(this);
};

Picture.prototype._timeout = function() {
  this._picture.src = '';
  this.element.classList.add('picture-load-failure');
};

Picture.prototype.remove = function() {
  this.element.removeEventListener('load', this.onPictureLoad);
  this.element.removeEventListener('error', this.onPictureError);
};



module.exports = Picture;
