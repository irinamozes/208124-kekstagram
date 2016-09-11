'use strict';
var GAP = 100;
module.exports = {
  //  Вычисление даты ближайшего дня рождения Grace Hopper
  cookiesTime: function() {
    var today = new Date();
    var hopperBirthday = new Date(today.getFullYear() + '-12' + '-09');
    if ((hopperBirthday.valueOf()) >= Date.now()) {
      hopperBirthday = new Date((today.getFullYear() - 1) + '-12' + '-09');
    }
    var expiresDate = ((Date.now() - hopperBirthday.valueOf())) / 1000 / 60 / 60 / 24;  // Срок жизни cookie
    return (expiresDate);
  },

  elementIsAtTheBottom: function(element) {
    var elementPosition = element.getBoundingClientRect();
    return elementPosition.top - window.innerHeight - GAP <= 0;
  },

  throttle: function(fn, timeout) {
    return function() {
      clearTimeout(fn._timeoutID);
      fn._timeoutID = setTimeout(fn, timeout);
    };
  }


};
