
/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {

  var Resizer = require('./resizer');

  var IMAGE_LOAD_TIMEOUT = 100;

  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  var selectedFilter;

  var browserCookies = require('browser-cookies');
  var uploadFilter;

  //  Вычисление даты ближайшего дня рождения Grace Hopper
  var utils = require('./utils');

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  var butFwd = document.querySelector('.upload-form-controls-fwd');
  var fieldInput = document.querySelector('.upload-resize-controls');

  var leftPos = document.getElementById('resize-x');
  var rightPos = document.getElementById('resize-y');
  var size = document.getElementById('resize-size');

  leftPos.value = 0;
  rightPos.value = 0;
  size.value = 50;

  leftPos.min = 0;
  rightPos.min = 0;
  size.min = 50;


//Синхронизирует данные ресайзера и формы при передвижении изображения мышкой
  function sinchFormResize() {
    if (currentResizer !== null) {
      if (currentResizer.getConstraint().x > 0) {
        leftPos.value = currentResizer.getConstraint().x;
      } else {
        leftPos.value = 0;
      }

      if (currentResizer.getConstraint().y > 0) {
        rightPos.value = currentResizer.getConstraint().y;
      } else {
        rightPos.value = 0;
      }
      if (parseInt(leftPos.value, 10) + parseInt(size.value, 10) > currentResizer._image.naturalWidth || (parseInt(rightPos.value, 10) + parseInt(size.value, 10)) > currentResizer._image.naturalHeight) {
        butFwd.disabled = true;

      } else {
        butFwd.disabled = false;
      }
    }
  }

  window.addEventListener('resizerchange', sinchFormResize);

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
 */
  function resizeFormIsValid() {
    var imageW = currentResizer._image.naturalWidth;
    var imageH = currentResizer._image.naturalHeight;

    size.max = Math.min(imageW - leftPos.value, imageH - rightPos.value);
    if (parseInt(leftPos.value, 10) + parseInt(size.value, 10) > imageW || (parseInt(rightPos.value, 10) + parseInt(size.value, 10)) > imageH) {
      butFwd.disabled = true;
      return false;
    }
    butFwd.disabled = false;
    currentResizer.setKadr(parseInt(leftPos.value, 10), parseInt(rightPos.value, 10), parseInt(size.value, 10));
    return true;
  }


  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.onchange = function(evt) {
    fieldInput.addEventListener('input', resizeFormIsValid);
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();
        showMessage(Action.UPLOADING);

        var _timeout;

        fileReader.onload = function() {

          currentResizer = new Resizer(fileReader.result);

          currentResizer.setElement(resizeForm);

          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');

          resizeForm.classList.remove('invisible');

          hideMessage();

          _timeout = setTimeout(function() {
            leftPos.value = 0;
            rightPos.value = 0;
            size.value = Math.min(
                currentResizer._image.naturalWidth * window.INITIAL_SIDE_RATIO,
                currentResizer._image.naturalHeight * window.INITIAL_SIDE_RATIO);
            resizeFormIsValid();
          }, IMAGE_LOAD_TIMEOUT);

          if(currentResizer._image.naturalWidth !== 0 && currentResizer._image.naturalHeight !== 0) {
            leftPos.value = 0;
            rightPos.value = 0;
            size.value = Math.min(
                currentResizer._image.naturalWidth * window.INITIAL_SIDE_RATIO,
                currentResizer._image.naturalHeight * window.INITIAL_SIDE_RATIO);
            clearTimeout(_timeout);
            resizeFormIsValid();
          }

        };
        fileReader.readAsDataURL(element.files[0]);

      } else {
        fieldInput.removeEventListener('input', resizeFormIsValid);
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  };

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.onreset = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    fieldInput.removeEventListener('input', resizeFormIsValid);
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      var image = currentResizer.exportImage().src;

      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
      }

      filterImage.src = image;

      fieldInput.removeEventListener('input', resizeFormIsValid);
      filterImage.src = currentResizer.exportImage().src;
      resizeForm.classList.add('invisible');

      uploadFilter = browserCookies.get('upload-filter') || 'none';
      document.getElementById('upload-filter-' + uploadFilter).setAttribute('checked', 'checked');
      filterImage.className = 'filter-image-preview ' + 'filter-' + uploadFilter;

      filterForm.classList.remove('invisible');
    }
  };

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.onreset = function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
    fieldInput.addEventListener('input', resizeFormIsValid);
  };

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.onsubmit = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();
    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.onchange = function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia',
        'marvin': 'filter-marvin'
      };
    }

    selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
    browserCookies.set('upload-filter', selectedFilter, {expires: utils.cookiesTime() });
  };

  cleanupResizer();
  updateBackground();
})();
