'use strict';

(function() {

  window.INITIAL_SIDE_RATIO = 0.75;

  /**
   * @constructor
   * @param {string} image
   */
  var Resizer = function(image) {
    // Изображение, с которым будет вестись работа.
    this._image = new Image();
    this._image.src = image;

    // Холст.
    this._container = document.createElement('canvas');
    this._ctx = this._container.getContext('2d');

    // Создаем холст только после загрузки изображения.
    this._image.onload = function() {
      // Размер холста равен размеру загруженного изображения. Это нужно
      // для удобства работы с координатами.
      this._container.width = this._image.naturalWidth;
      this._container.height = this._image.naturalHeight;

      /**
       * Предлагаемый размер кадра в виде коэффициента относительно меньшей
       * стороны изображения.
       * @const
       * @type {number}
       */

      // Размер меньшей стороны изображения.
      var side = Math.min(
          this._container.width * window.INITIAL_SIDE_RATIO,
          this._container.height * window.INITIAL_SIDE_RATIO);

      //Первоначальный размер кадра

      // Изначально предлагаемое кадрирование — часть по центру с размером в 3/4
      // от размера меньшей стороны.
      this._resizeConstraint = new Square(
          this._container.width / 2 - side / 2,
          this._container.height / 2 - side / 2,
          side);

      this._resizeKadr = new SquareKadr(
          this._container.width / 2 - side / 2,
          this._container.height / 2 - side / 2,
          side);

      // Отрисовка изначального состояния канваса.
      this.setConstraint();
      this.sideBegin = side;
    }.bind(this);

    // Фиксирование контекста обработчиков.
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._onDrag = this._onDrag.bind(this);

  };

  /**
   * Родительский элемент канваса.
   * @type {Element}
   * @private
   */

  Resizer.prototype._element = null;

    /**
     * Положение курсора в момент перетаскивания. От положения курсора
     * рассчитывается смещение на которое нужно переместить изображение
     * за каждую итерацию перетаскивания.
     * @type {Coordinate}
     * @private
     */
  Resizer.prototype._cursorPosition = null;

    /**
     * Объект, хранящий итоговое кадрирование: сторона квадрата и смещение
     * от верхнего левого угла исходного изображения.
     * @type {Square}
     * @private
     */
  Resizer.prototype._resizeConstraint = null;

    //Объект, хранящий текущий размер рамки кадра
  Resizer.prototype._resizeKadr = null;

    /**
     * Отрисовка канваса.
     */
  Resizer.prototype.redraw = function() {
      // Очистка изображения.
    this._ctx.clearRect(0, 0, this._container.width, this._container.height);

      // Параметры линии.
      // NB! Такие параметры сохраняются на время всего процесса отрисовки
      // canvas'a поэтому важно вовремя поменять их, если нужно начать отрисовку
      // чего-либо с другой обводкой.

      // Толщина линии.
    this._ctx.lineWidth = 6;
      // Цвет обводки.
    this._ctx.strokeStyle = '#ffe753';
      // Размер штрихов. Первый элемент массива задает длину штриха, второй
      // расстояние между соседними штрихами.
    this._ctx.setLineDash([15, 10]);
      // Смещение первого штриха от начала линии.
    this._ctx.lineDashOffset = 7;

      // Сохранение состояния канваса.
    this._ctx.save();

      // Установка начальной точки системы координат в центр холста.
    this._ctx.translate(this._container.width / 2, this._container.height / 2);

    var displX = -(this._resizeConstraint.x + this._resizeConstraint.side / 2);
    var displY = -(this._resizeConstraint.y + this._resizeConstraint.side / 2);
      // Отрисовка изображения на холсте. Параметры задают изображение, которое
      // нужно отрисовать и координаты его верхнего левого угла.
      // Координаты задаются от центра холста.
    this._ctx.drawImage(this._image, displX, displY);

      // Отрисовка прямоугольника, обозначающего область изображения после
      // кадрирования. Координаты задаются от центра.
    this._ctx.strokeRect(
          Math.round((-this._resizeKadr.side / 2) + this._ctx.lineWidth / 2),
          Math.round((-this._resizeKadr.side / 2 + this._ctx.lineWidth / 2)),
          Math.round(this._resizeKadr.side - this._ctx.lineWidth * 3 / 2),
          Math.round(this._resizeKadr.side - this._ctx.lineWidth * 3 / 2));

      //Отрисовка вертикальных и горизонтальных прямоугольников вокруг области
      // кадрирования, обозначающих черный слой с прозрачностью 80%. Координаты левого
      //верхнего угла задаются от центра.
    var lineWidthKadr = this._ctx.lineWidth;
    this._ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this._ctx.fillRect(
          Math.round(-this._container.width / 2), Math.round(-this._container.height / 2),
          Math.round(this._container.width / 2 - (this._resizeKadr.side / 2)),
          Math.round(this._container.height));

    this._ctx.fillRect(
          Math.round(this._resizeKadr.side / 2 - lineWidthKadr / 2),
          Math.round(-this._container.height / 2),
          Math.round(this._container.width / 2 - (this._resizeKadr.side / 2 - lineWidthKadr / 2)),
          Math.round(this._container.height));

    this._ctx.fillRect(
          Math.round((-this._resizeKadr.side / 2)),
          Math.round(-this._container.height / 2),
          Math.floor(this._resizeKadr.side - lineWidthKadr / 2),
          Math.round(this._container.height / 2 - (this._resizeKadr.side / 2)));

    this._ctx.fillRect(
          Math.round((-this._resizeKadr.side / 2)),
          Math.round((this._resizeKadr.side / 2) - lineWidthKadr / 2),
          Math.floor(this._resizeKadr.side - lineWidthKadr / 2 ),
          Math.round(this._container.height / 2 - (this._resizeKadr.side / 2 - lineWidthKadr / 2)));

      //Вывод текста с размерами изображения
    var _width = this._container.width + ' ';
    var _height = ' ' + this._container.height;
    this._ctx.font = '14px PT Mono';
    this._ctx.fillStyle = 'white';
    var textWidth = this._ctx.measureText(_width).width;
    this._ctx.fillText(_width + 'x' + _height, -(textWidth), -(this._resizeConstraint.side / 2 + 14));


      // Восстановление состояния канваса, которое было до вызова ctx.save
      // и последующего изменения системы координат. Нужно для того, чтобы
      // следующий кадр рисовался с привычной системой координат, где точка
      // 0 0 находится в левом верхнем углу холста, в противном случае
      // некорректно сработает даже очистка холста или нужно будет использовать
      // сложные рассчеты для координат прямоугольника, который нужно очистить.
    this._ctx.restore();
  };

    /**
     * Включение режима перемещения. Запоминается текущее положение курсора,
     * устанавливается флаг, разрешающий перемещение и добавляются обработчики,
     * позволяющие перерисовывать изображение по мере перетаскивания.
     * @param {number} x
     * @param {number} y
     * @private
     */
  Resizer.prototype._enterDragMode = function(x, y) {
    this._cursorPosition = new Coordinate(x, y);
    document.body.addEventListener('mousemove', this._onDrag);
    document.body.addEventListener('mouseup', this._onDragEnd);
  };

    /**
     * Выключение режима перемещения.
     * @private
     */
  Resizer.prototype._exitDragMode = function() {
    this._cursorPosition = null;
    document.body.removeEventListener('mousemove', this._onDrag);
    document.body.removeEventListener('mouseup', this._onDragEnd);
  };

    /**
     * Перемещение изображения относительно кадра.
     * @param {number} x
     * @param {number} y
     * @private
     */
  Resizer.prototype.updatePosition = function(x, y) {
    this.moveConstraint(
        this._cursorPosition.x - x,
        this._cursorPosition.y - y);
    this._cursorPosition = new Coordinate(x, y);
  };

    /**
     * @param {MouseEvent} evt
     * @private
     */
  Resizer.prototype._onDragStart = function(evt) {
    this._enterDragMode(evt.clientX, evt.clientY);
  };

    /**
     * Обработчик окончания перетаскивания.
     * @private
     */
  Resizer.prototype._onDragEnd = function() {
    this._exitDragMode();
  };

    /**
     * Обработчик события перетаскивания.
     * @param {MouseEvent} evt
     * @private
     */
  Resizer.prototype._onDrag = function(evt) {
    this.updatePosition(evt.clientX, evt.clientY);
  };

    /**
     * Добавление элемента в DOM.
     * @param {Element} element
     */
  Resizer.prototype.setElement = function(element) {
    if (this._element === element) {
      return;
    }

    this._element = element;
    this._element.insertBefore(this._container, this._element.firstChild);
    this._container.addEventListener('mousedown', this._onDragStart);
  };

    /**
     * Возвращает кадрирование элемента.
     * @return {Square}
     */
  Resizer.prototype.getConstraint = function() {
    return this._resizeConstraint;
  };

    /**
     * Смещает кадрирование на значение указанное в параметрах.
     * @param {number} deltaX
     * @param {number} deltaY
     * @param {number} deltaSide
     */
  Resizer.prototype.moveConstraint = function(deltaX, deltaY, deltaSide) {
    this.setConstraint(
          this._resizeConstraint.x + (deltaX || 0),
          this._resizeConstraint.y + (deltaY || 0),
          this._resizeConstraint.side + (deltaSide || 0));
  };

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} side
     */
  Resizer.prototype.setConstraint = function(x, y, side) {
    if (typeof x !== 'undefined' && x !== null) {
      this._resizeConstraint.x = x;
    }

    if (typeof y !== 'undefined' && y !== null) {
      this._resizeConstraint.y = y;
    }
    if (typeof side !== 'undefined' && side !== null) {
      this._resizeConstraint.side = side;
    }

    requestAnimationFrame(function() {
      this.redraw();
      window.dispatchEvent(new CustomEvent('resizerchange'));
    }.bind(this));

  };

    // Положение рамки кадра
  Resizer.prototype.setKadr = function(x, y, side) {
    if (this._resizeKadr !== null) {
      if (typeof x !== 'undefined' && x !== null) {
        this._resizeKadr.x = x;
      }

      if (typeof y !== 'undefined' && y !== null) {
        this._resizeKadr.y = y;
      }

      if (typeof side !== 'undefined' && side !== null) {
        this._resizeKadr.side = side;
      }
    }
    requestAnimationFrame(function() {
      this.redraw();
      window.dispatchEvent(new CustomEvent('resizerchange'));

    }.bind(this));

  };


    /**
     * Удаление. Убирает контейнер из родительского элемента, убирает
     * все обработчики событий и убирает ссылки.
     */
  Resizer.prototype.remove = function() {
    this._element.removeChild(this._container);

    this._container.removeEventListener('mousedown', this._onDragStart);
    this._container = null;
  };

    /**
     * Экспорт обрезанного изображения как HTMLImageElement и исходником
     * картинки в src в формате dataURL.
     * @return {Image}
     */
  Resizer.prototype.exportImage = function() {
      // Создаем Image, с размерами, указанными при кадрировании.
    var imageToExport = new Image();

      // Создается новый canvas, по размерам совпадающий с кадрированным
      // изображением, в него добавляется изображение взятое из канваса
      // с измененными координатами и сохраняется в dataURL, с помощью метода
      // toDataURL. Полученный исходный код, записывается в src у ранее
      // созданного изображения.
    var temporaryCanvas = document.createElement('canvas');
    var temporaryCtx = temporaryCanvas.getContext('2d');
    temporaryCanvas.width = parseInt(this._resizeKadr.side, 10);
    temporaryCanvas.height = parseInt(this._resizeKadr.side, 10);

    temporaryCtx.drawImage(this._image,
            Math.round(-this.sideBegin / 2 + parseInt(this._resizeKadr.side / 2, 10) - this._resizeConstraint.x),
            Math.round(-this.sideBegin / 2 + parseInt(this._resizeKadr.side / 2, 10) - this._resizeConstraint.y));

    imageToExport.src = temporaryCanvas.toDataURL('image/png');

    return imageToExport;
  };

  /**
   * Вспомогательный тип, описывающий квадрат.
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {number} side
   * @private
   */
  var Square = function(x, y, side) {
  //var Square = function(x, y) {
    this.x = x;
    this.y = y;
    this.side = side;
  };

  var SquareKadr = function(x, y, side) {
    this.x = x;
    this.y = y;
    this.side = side;
  };

  /**
   * Вспомогательный тип, описывающий координату.
   * @constructor
   * @param {number} x
   * @param {number} y
   * @private
   */
  var Coordinate = function(x, y) {
    this.x = x;
    this.y = y;
  };

  module.exports = Resizer;
})();
