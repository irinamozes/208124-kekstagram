'use strict';
//  Вычисление даты ближайшего дня рождения Grace Hopper
module.exports = function() {
  var today = new Date();
  var hopperBirthday = new Date(today.getFullYear() + '-12' + '-09');
  if ((hopperBirthday.valueOf()) >= Date.now()) {
    hopperBirthday = new Date((today.getFullYear() - 1) + '-12' + '-09');
  }
  var expiresDate = ((Date.now() - hopperBirthday.valueOf())) / 1000 / 60 / 60 / 24;  // Срок жизни cookie
  return (expiresDate);
};
