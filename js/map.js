'use strict';

var OFFERS_COUNT = 8;
var IMG_WIDTH = 45;
var IMG_HEIGHT = 40;
var IMG_ALT = 'Фотография жилья';
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var CHECKIN_HOURS = ['12:00', '13:00', '14:00'];
var CHECKOUT_HOURS = ['12:00', '13:00', '14:00'];
var TIMES = ['12:00', '13:00', '14:00'];
var TYPES = ['bungalo', 'flat', 'house', 'palace'];
var PRICES = [0, 1000, 5000, 10000];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
var PIN_HALF_HEIGHT = 42;
var PIN_HALF_WIDTH = 31;
var MIN_COORD = {
  X: 63 - PIN_HALF_WIDTH,
  Y: 142 - PIN_HALF_HEIGHT
};
var MAX_COORD = {
  X: 1151 - PIN_HALF_WIDTH,
  Y: 672 - PIN_HALF_HEIGHT
};

var createOffer = function (i) {
  var locationX = getRandomNumber(300, 900);
  var locationY = getRandomNumber(130, 630);
  return {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
    },
    offer: {
      title: TITLES[i],
      type: getItrValue(TYPES),
      address: locationX + ',' + locationY,
      price: getRandomNumber(1000, 1000000),
      features: getRandomArrayElements(),
      rooms: getRandomNumber(1, 5),
      guests: getRandomNumber(1, 25),
      checkin: getItrValue(CHECKIN_HOURS),
      checkout: getItrValue(CHECKOUT_HOURS),
      description: '',
      photos: []
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getItrValue = function (arr) {
  var randomIndex = getRandomNumber(0, arr.length - 1);
  return arr[randomIndex];
};

var getRandomArrayElements = function () {
  var elements = [];
  for (var i = 0; i < FEATURES.length; i++) {
    if (Math.random() > 0.5) {
      elements.push(FEATURES[i]);
    }
  }
  return elements;
};

var getOffers = function (countOfOffers) {
  var offers = [];
  for (var i = 0; i < countOfOffers; i++) {
    offers.push(createOffer(i));
  }
  return offers;
};
var offersArray = getOffers(OFFERS_COUNT);

var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var map = document.querySelector('.map');
var mapPinsContainer = document.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');
var pageState = 'disabled';
var adForm = document.querySelector('.ad-form');
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

var synchronizeFields = function (firstElement, secondElement, firstValue, secondValue, callback) {
  var firstElementChangeHandler = function () {
    var newFirstValue = secondValue[firstValue.indexOf(firstElement.value)];
    callback(secondElement, newFirstValue);
  };
  firstElement.addEventListener('change', firstElementChangeHandler);

  var secondElementChangeHandler = function () {
    var newSecondValue = firstValue[secondValue.indexOf(secondElement.value)];
    callback(firstElement, newSecondValue);
  };
  secondElement.addEventListener('change', secondElementChangeHandler);
};

var syncValues = function (element, value) {
  element.value = value;
};
synchronizeFields(timeIn, timeOut, TIMES, TIMES, syncValues);

var syncValueWithMin = function (element, value) {
  element.min = value;
};
synchronizeFields(type, priceInput, TYPES, PRICES, syncValueWithMin);
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

var setImage = function (fileChooser, callback) {
  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var similars = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (similars) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        callback(reader.result);
      });

      reader.readAsDataURL(file);
    }
  });
};
setImage(fileChooserAvatar, avatarClickHandler);

var photoClickHandler = function (result) {
  var previewPhoto = document.createElement('img');
  previewPhoto.src = result;
  previewPhoto.style = 'max-width: 100px; max-height: 100px; margin-top: 10px;';
  photosContainer.appendChild(previewPhoto);
};
setImage(fileChooserPhotos, photoClickHandler);

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

var onMapPinMainMouseDown = function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onDocumentMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var coordinates = {
      x: mapPinMain.offsetLeft - shift.x,
      y: mapPinMain.offsetTop - shift.y
    };

    if (coordinates.x < MIN_COORD.X) {
      coordinates.x = MIN_COORD.X;
    } else if (coordinates.x > MAX_COORD.X) {
      coordinates.x = MAX_COORD.X;
    }

    if (coordinates.y < MIN_COORD.Y) {
      coordinates.y = MIN_COORD.Y;
    } else if (coordinates.y > MAX_COORD.Y) {
      coordinates.y = MAX_COORD.Y;
    }

    mapPinMain.style.top = coordinates.y + 'px';
    mapPinMain.style.left = coordinates.x + 'px';

    setAddress(coordinates.x, coordinates.y);
  };

  var onDocumentMouseUp = function (upEvt) {
    upEvt.preventDefault();
    if (pageState === 'disabled') {
      enablePageState();
    }

    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
  };

  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
};

mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);

var makePinItem = function (ad) {
  var pinItem = pinTemplate.cloneNode(true);
  var pinAvatar = pinItem.querySelector('img');

  pinItem.style.left = ad.location.x + 'px';
  pinItem.style.top = ad.location.y + 'px';
  pinAvatar.src = ad.author.avatar;
  pinAvatar.alt = ad.offer.title;

  pinItem.addEventListener('click', function () {
    if (map.querySelector('.map__card')) {
      onCloseCardItemClick();
    }
    openCardItem(ad);
    pinItem.classList.add('map__pin--active');
  });

  return pinItem;
};

var renderPins = function (list) {
  var fragment = document.createDocumentFragment();

  list.forEach(function (it) {
    fragment.appendChild(makePinItem(it));
  });
  return fragment;
};
var pinsFragment = renderPins(offersArray);

var cardTemplate = template.content.querySelector('.map__card');

var createFeatureItem = function (item) {
  var featureItem = document.createElement('li');
  featureItem.classList.add('popup__feature');
  featureItem.classList.add('popup__feature--' + item);
  return featureItem;
};

var createPhotoItem = function (item) {
  var photoItem = document.createElement('img');
  photoItem.src = item;
  photoItem.width = IMG_WIDTH;
  photoItem.height = IMG_HEIGHT;
  photoItem.classList.add('popup__photo');
  photoItem.alt = IMG_ALT;
  return photoItem;
};

var createCollectionFromArray = function (array, renderFunction) {
  var fragment = document.createDocumentFragment();
  array.forEach(function (item) {
    fragment.appendChild(renderFunction(item));
  });
  return fragment;
};

var removeChildren = function (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

var createCardItem = function (ad) {
  var cardItem = cardTemplate.cloneNode(true);
  var cardItemFeaturesItem = cardItem.querySelector('.popup__features');
  var cardItemPhotosItem = cardItem.querySelector('.popup__photos');
  var cardItemTypesItem = cardItem.querySelector('.popup__type');
  var closeCardItem = cardItem.querySelector('.popup__close');

  closeCardItem.addEventListener('click', onCloseCardItemClick);

  cardItem.querySelector('.popup__title').textContent = ad.offer.title;
  cardItem.querySelector('.popup__text--address').textContent = ad.offer.address;
  cardItem.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  switch (ad.offer.type) {
    case 'flat':
      cardItemTypesItem.textContent = 'Квартира';
      break;
    case 'bungalo':
      cardItemTypesItem.textContent = 'Бунгало';
      break;
    case 'house':
      cardItemTypesItem.textContent = 'Дом';
      break;
    case 'palace':
      cardItemTypesItem.textContent = 'Дворец';
      break;
  }

  cardItem.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  cardItem.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  removeChildren(cardItemFeaturesItem);
  cardItemFeaturesItem.appendChild(createCollectionFromArray(ad.offer.features, createFeatureItem));
  cardItem.querySelector('.popup__description').textContent = ad.offer.description;

  removeChildren(cardItemPhotosItem);
  cardItemPhotosItem.appendChild(createCollectionFromArray(ad.offer.photos, createPhotoItem));
  cardItem.querySelector('.popup__avatar').src = ad.author.avatar;
  return cardItem;
};

var renderCard = function (ad) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(createCardItem(ad));
  return fragment;
};

var openCardItem = function (ad) {
  map.insertBefore(renderCard(ad), map.querySelector('.map__filters-container'));
};

var onCloseCardItemClick = function () {
  var mapCard = map.querySelector('.map__card');
  if (mapCard) {
    var closeCardItem = mapCard.querySelector('.popup__close');
    if (closeCardItem) {
      closeCardItem.removeEventListener('click', onCloseCardItemClick);
    }
    mapCard.remove();
  }
  var currentPin = map.querySelector('.map__pin--active');
  if (currentPin) {
    currentPin.classList.remove('map__pin--active');
  }
};
