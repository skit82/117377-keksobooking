'use strict';

(function () {
  var TIMES = ['12:00', '13:00', '14:00'];
  var TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var PRICES = [0, 1000, 5000, 10000];

  var adForm = document.querySelector('.ad-form');
  var map = document.querySelector('.map');
  var mapPinsContainer = document.querySelector('.map__pins');
  var featuresFields = adForm.querySelectorAll('.features input[type=checkbox]');
  var title = document.querySelector('#title');
  var addressInput = document.querySelector('#address');
  var fieldsetForm = document.querySelectorAll('fieldset');
  var type = document.querySelector('#type');
  var priceInput = document.querySelector('#price');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var roomNumber = document.querySelector('#room_number');
  var roomCapacity = document.querySelector('#capacity');
  var fileChooserAvatar = document.querySelector('#avatar');
  var fileChooserPhotos = document.querySelector('#images');
  var descriptionField = document.querySelector('#description');
  var photosContainer = document.querySelector('.form__photo-container');
  var avatar = document.querySelector('.ad-form-header__preview img');

  var addDisabledFieldset = function () {
    for (var i = 0; i < fieldsetForm.length; i++) {
      fieldsetForm[i].disabled = true;
    }
  };
  addDisabledFieldset();

  var removeDisabledFieldset = function () {
    for (var i = 0; i < fieldsetForm.length; i++) {
      fieldsetForm[i].removeAttribute('disabled');
    }
  };
  removeDisabledFieldset();

  var titleInvalidHandler = function () {
    if (title.validity.tooShort && title.validity.tooLong && title.validity.valueMissing) {
      title.setAttribute('style', 'border-color: red');
    } else {
      title.setCustomValidity('');
      title.removeAttribute('style');
    }
  };
  title.addEventListener('invalid', titleInvalidHandler);

  var priceInputInvalidHandler = function () {
    if (priceInput.validity.rangeUnderflow && priceInput.validity.rangeOverflow && priceInput.validity.typeMismatch) {
      priceInput.setAttribute('style', 'border-color: red');
    } else {
      priceInput.removeAttribute('style');
    }
  };

  var syncValues = function (element, value) {
    element.value = value;
  };
  window.synchronize.synchronizeFields(timeIn, timeOut, TIMES, TIMES, syncValues);

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };
  window.synchronize.synchronizeFields(type, priceInput, TYPES, PRICES, syncValueWithMin);
  priceInput.addEventListener('invalid', priceInputInvalidHandler);

  var disableRoomSelects = function () {
    for (var i = 0; i < roomCapacity.length; i++) {
      roomCapacity[i].disabled = true;
    }
  };

  var roomNumberChangeHandler = function (evt) {
    disableRoomSelects();
    var choosenValue = (evt.target.value === '100') ? '0' : evt.target.value;
    for (var i = 0; i < roomCapacity.length; i++) {
      if (roomCapacity[i].value === choosenValue) {
        roomCapacity[i].disabled = false;
      }
      if (roomCapacity[i].value <= choosenValue && roomCapacity[i].value > 0) {
        roomCapacity[i].disabled = false;
      }
    }
  };

  roomNumber.addEventListener('change', roomNumberChangeHandler);

  var avatarClickHandler = function (result) {
    avatar.src = result;
  };

  window.loadPhoto.setImage(fileChooserAvatar, avatarClickHandler);

  var photoClickHandler = function (result) {
    var previewPhoto = document.createElement('img');
    previewPhoto.src = result;
    previewPhoto.style = 'max-width: 100px; max-height: 100px; margin-top: 10px;';
    photosContainer.appendChild(previewPhoto);
  };

  window.loadPhoto.setImage(fileChooserPhotos, photoClickHandler);

  var enablePageState = function () {
    map.classList.remove('map--faded');
    pageState = 'enabled';
    adForm.classList.remove('ad-form--disabled');
    mapPinsContainer.appendChild(pinsFragment);
  };

  var setAddress = function (xCoord, yCoord) {
    var addressString = 'x: ' + xCoord + ', ' + 'y: ' + yCoord;

    addressInput.setAttribute('value', addressString);
  };

  var onLoad = function () {
    var fragment = document.createDocumentFragment();
    var div = document.createElement('div');
    var p = document.createElement('p');
    div.classList.add('success-message');
    div.style = 'position: fixed; z-index: 10; width: 300px; height: 50px; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #6EBC72; color: #ffffff; text-align: center; border: 2px solid white';
    p.textContent = 'Данные успешно отправлены';
    div.appendChild(p);
    fragment.appendChild(div);
    window.setTimeout(function () {
      document.querySelector('.success-message').style = 'display: none;';
    }, 3000);

    syncValues(title, '');
    syncValues(TYPES, 'flat');
    syncValues(priceInput, '1000');
    syncValues(timeIn, '12:00');
    syncValues(timeOut, '12:00');
    roomNumber.selectedIndex = 0;
    roomCapacity.selectedIndex = 2;
    featuresFields.forEach(function (elem) {
      elem.checked = false;
    });
    syncValues(descriptionField, '');
  };

  window.form = {
    removeDisabledFieldset: removeDisabledFieldset,
    adForm: adForm,
    setAddress: setAddress,
    enablePageState: enablePageState
  };
})();
