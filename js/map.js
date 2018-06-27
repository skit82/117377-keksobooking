'use strict';

var OFFERS_COUNT = 8;
var IMG_WIDTH = 45;
var IMG_HEIGHT = 40;
var IMG_ALT = 'Фотография жилья';
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var CHECKIN_HOURS = ['12:00', '13:00', '14:00'];
var CHECKOUT_HOURS = ['12:00', '13:00', '14:00'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

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
var adForm = document.querySelector('.ad-form');
var pageState = 'disabled';
var addressInput = document.querySelector('#address');

addressInput.value = 'x, y';
var enablePageState = function () {
  map.classList.remove('map--faded');
  pageState = 'enabled';
  adForm.classList.remove('ad-form--disabled');
  mapPinsContainer.appendChild(pinsFragment);
};

var getCoords = function (x, y) {
  var box = mapPinMain.getCoords();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

var onMapPinMainMouseDown = function (evt) {
  evt.preventDefault();
  var onDocumentMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var onDocumentMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (pageState === 'disabled') {
        enablePageState();
      }
      getCoords();
      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };

    document.addEventListener('mouseup', onDocumentMouseUp);
  };
  document.addEventListener('mousemove', onDocumentMouseMove);
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
