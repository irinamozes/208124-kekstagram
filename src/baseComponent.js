'use strict';

var BaseComponent = function(element) {
  this.element = element;
};

BaseComponent.prototype.addElement = function(container) {
  container.appendChild(this.element);
};

BaseComponent.prototype.remove = function() {
  this.element.parentNode.removeChild(this.element);
};

module.exports = BaseComponent;
