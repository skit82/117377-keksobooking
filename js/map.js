'use strict'

var OFFERS_COUNT = 8;
var IMG_WIDTH = 45;
var IMG_HEIGHT = 40;
var IMG_ALT = 'Фотография жилья';
var TITLES = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var CHECKIN_HOURS = ['12:00', '13:00', '14:00'];
var CHECKOUT_HOURS = ['12:00', '13:00', '14:00'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getItrValue = function (arr) {
  var randomIndex = getRandomNumber (0, arr.length - 1);
  return arr[randomIndex];
};
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var getRandomArrayElements = function () {
  var elements = [];
  for (var i = 0; i < FEATURES.length; i++) {
    if (Math.random() > 0.5) {
      elements.push(FEATURES[i]);
    }
  }
  return elements;
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
      type: getItrValue (TYPES),
      address: locationX + ',' + locationY,
      price: getRandomNumber (1000, 1000000),
      features: getRandomArrayElements (),
      rooms: getRandomNumber (1, 5),
      guests: getRandomNumber (1, 25),
      checkin: getItrValue (CHECKIN_HOURS),
      checkout: getItrValue (CHECKOUT_HOURS),
      description: '',
      photos: []
    },
    location: {
      x: locationX,
      y: locationY
    }
  }
};

var getOffers = function (countOfOffers) {
  var offers = [];
  for (var i = 0; i < countOfOffers; i++) {
    offers.push(createOffer(i));
  }
  return offers;
};
var offersArray = getOffers(OFFERS_COUNT);

var hideMap = function () {
  var cityMap = document.querySelector('.map');
  cityMap.classList.remove('map--faded');
};
hideMap();

var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var map = document.querySelector('.map');
var mapPinsContainer = document.querySelector('.map__pins');

var makePinItem = function (ad) {
  var pinItem = pinTemplate.cloneNode(true);
  var pinAvatar = pinItem.querySelector('img');

  pinItem.style.left = ad.location.x + 'px';
  pinItem.style.top = ad.location.y + 'px';
  pinAvatar.src = ad.author.avatar;
  pinAvatar.alt = ad.offer.title;
  return pinItem;
};

var renderPins = function (arrd) {
  var fragment = document.createDocumentFragment();

  arrd.forEach(function (arrd) {
    fragment.appendChild(makePinItem(arrd));
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
  };

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
  map.insertBefore(renderCard(ad),
    map.querySelector('.map__filters-container'));
};

mapPinsContainer.appendChild(pinsFragment);
openCardItem(offersArray[0]);
