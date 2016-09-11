'use strict';
var pictures = null;

var getSearchString = function(params) {
  return Object.keys(params).map(function(param) {
    return [param, params[param]].join('=');
  }).join('&');
};

module.exports = function(addres, params, callback, callback2) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    pictures = JSON.parse(evt.target.response);
    var lengthPictures = pictures.length;
    callback(pictures);
    callback2(lengthPictures);
  };

  xhr.open('GET', addres + '?' + getSearchString(params));

  xhr.send();
};
