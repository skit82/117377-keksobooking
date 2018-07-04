'use strict';

var OFFERS_COUNT = 8;
var TYPES = ['bungalo', 'flat', 'house', 'palace'];
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var CHECKIN_HOURS = ['12:00', '13:00', '14:00'];
var CHECKOUT_HOURS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var PIN_HALF_HEIGHT = 42;
var PIN_HALF_WIDTH = 31;
var MIN_COORD = {
  X: 63 - PIN_HALF_WIDTH,
  Y: 172 - PIN_HALF_HEIGHT
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

var pageState = 'disabled';
var template = document.querySelector('template');
var mapPinMain = document.querySelector('.map__pin--main');

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

    window.form.setAddress(coordinates.x, coordinates.y);
  };

  var onDocumentMouseUp = function (upEvt) {
    upEvt.preventDefault();
    if (pageState === 'disabled') {
      window.form.enablePageState();
    }

    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
  };

  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
};

mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);

window.map = {
  getOffers: getOffers,
  OFFERS_COUNT: OFFERS_COUNT
}
