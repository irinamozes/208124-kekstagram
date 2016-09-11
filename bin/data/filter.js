'use strict';

module.exports = function(list, filterID) {
  switch(filterID) {
    case 'filter-popular':
      return list;

    case 'filter-new':
      var _date;
      list = list.filter(
        function(dat) {
          _date = dat.created;
          return (_date <= Date.now() && _date > Date.now() - 3 * 24 * 60 * 60 * 1000);
        });

      list = list.sort(function(a, b) {
        return (b.created - a.created);
      });

      break;

    case 'filter-discussed':
      return list.sort(function(a, b) {
        return b.comments - a.comments;
      });

  }

  return list;
};
