'use strict';

function getMessage(a, b) {
    var mes;
      if (typeof a === 'boolean') {
        if (a) {
          mes = "Переданное GIF-изображение анимировано и содержит " + b + "кадров";
         }
        else {
          mes = "Переданное GIF-изображение не анимировано";
         }
      }

       else {
         if (typeof a === 'number') {
         mes = "Переданное SVG-изображение содержит " + a + " объектов и " + (b * 4) + " атрибутов";
         }
         else {
           if (Array.isArray(a) && Array.isArray(b)) {
             var lengthmin=0;
             a.forEach(function(item, i){
              lengthmin += item * b[i];
             return lengthmin;
          });

          mes="Общая площадь артефактов сжатия: " + lengthmin + " пикселей";

        } else {
            if (Array.isArray(a)) {
              var sum = a.reduce(function(c, d) {
              return c + d;
              });

                mes = "Количество красных точек во всех строчках изображения: " + sum;

            }
        }
    }
  }
    return mes;
}
