'use strict';

(function () {
  var IMG_WIDTH = 45;
  var IMG_HEIGHT = 40;
  var IMG_ALT = 'Фотография жилья';

  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card');
  var map = document.querySelector('.map');

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

  window.card = {
    openCardItem: openCardItem
  };
})();
