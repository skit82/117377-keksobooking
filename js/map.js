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
var VALID_CAPACITY_TEXT = 'Выберите допустимое количество гостей';
var TIMEOUT = 2000;
var ENABLE_FORM_FIELDS = false;
var DISABLE_FORM_FIELDS = true;
var SELECTED_ROOM_IMDEX = 0;
var VALID_CAPACITY = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};
var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
var AVATAR_DAFAULT_SRC = 'img/muffin-grey.svg';
var IMG_MARGIN = '3px';

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
var addressInput = document.querySelector('#address');
var fieldsetForm = document.querySelectorAll('fieldset');
var adFormType = adForm.querySelector('#type');
var adFormPrice = adForm.querySelector('#price');
var adFormCheckIn = adForm.querySelector('#timein');
var adFormCheckOut = adForm.querySelector('#timeout');
var adFormRoomsNumber = adForm.querySelector('#room_number');
var adFormCapacity = adForm.querySelector('#capacity');
var buttonReset = adForm.querySelector('.ad-form__reset');
var avatarInput = document.querySelector('.ad-form input[name="avatar"]');
var avatar = document.querySelector('.ad-form-header__preview img');
var photoInput = document.querySelector('.ad-form input[name="images"]');
var photoBox = document.querySelector('.ad-form__photo');
var avatarDropZone = document.querySelector('.ad-form-header__drop-zone');
var photoDropZone = document.querySelector('.ad-form__drop-zone');

var AdTypePrices = {
  palace: 10000,
  flat: 1000,
  house: 5000,
  bungalo: 0
};

var AdFormPhoto = {
  WIDTH: 70,
  HEIGHT: 70,
  MARGIN: 3
};

var draggedItemElement;

var checkFileOnImg = function (file) {
  var fileName = file.name.toLowerCase();

  return FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });
};

var renderImage = function (file, elem) {
  var reader = new FileReader();

  reader.addEventListener('load', function () {
    elem.src = reader.result;
  });

  reader.readAsDataURL(file);
};

var createHousingPhotosFragment = function (element) {
  var fragment = document.createDocumentFragment();

  Array.from(element.files).forEach(function (file) {

    if (checkFileOnImg(file)) {
      var imgElement = document.createElement('img');

      renderImage(file, imgElement);

      imgElement.width = AdFormPhoto.WIDTH;
      imgElement.height = AdFormPhoto.HEIGHT;
      imgElement.alt = IMG_ALT;
      imgElement.draggable = true;
      imgElement.style.marginRight = IMG_MARGIN;

      fragment.appendChild(imgElement);
      }
  });
  return fragment;
};

avatarInput.addEventListener('change', function () {
  renderImage(avatarInput.files[0], avatar);
});

avatarDropZone.addEventListener('dragenter', function (evt) {
  evt.target.style.outline = '2px solid red';
  evt.preventDefault();
});

avatarDropZone.addEventListener('dragleave', function (evt) {
  evt.target.style.outline = '';
  evt.preventDefault();
});

avatarDropZone.addEventListener('dragover', function (evt) {
  evt.preventDefault();
  return false;
});

avatarDropZone.addEventListener('drop', function (evt) {
  evt.preventDefault();
  evt.target.style.outline = '';

  renderImage(evt.dataTransfer.files[0], avatar);
});

photoInput.addEventListener('change', function () {
  photoBox.appendChild(createHousingPhotosFragment(photoInput));
});

photoDropZone.addEventListener('dragenter', function (evt) {
  evt.target.style.outline = '2px solid red';
  evt.preventDefault();
});

photoDropZone.addEventListener('dragleave', function (evt) {
  evt.target.style.outline = '';
  evt.preventDefault();
});

photoDropZone.addEventListener('dragover', function (evt) {
  evt.preventDefault();
  return false;
});

photoDropZone.addEventListener('drop', function (evt) {
  evt.preventDefault();

  evt.target.style.outline = '';

  var files = evt.dataTransfer;

  photoBox.appendChild(createHousingPhotosFragment(files));
});

photoBox.addEventListener('dragstart', function (evt) {
  if (evt.target.tagName === 'IMG') {
    draggedItemElement = evt.target;
  }
});

photoBox.addEventListener('dragover', function (evt) {
  evt.preventDefault();
});

photoBox.addEventListener('drop', function (evt) {
  var target = evt.target;
  if (target.tagName === 'IMG') {
    if (target.offsetTop === draggedItemElement.offsetTop) {
      if (target.offsetLeft < draggedItemElement.offsetLeft) {
        target.insertAdjacentElement('beforebegin', draggedItemElement);
      } else if (target.offsetLeft > draggedItemElement.offsetLeft) {
          target.insertAdjacentElement('afterend', draggedItemElement);
        }
    } else {
      if (target.offsetTop < draggedItemElement.offsetTop) {
        target.insertAdjacentElement('beforebegin', draggedItemElement);
      } else if (target.offsetTop > draggedItemElement.offsetTop) {
        target.insertAdjacentElement('afterend', draggedItemElement);
        }
      }
  }
  evt.preventDefault();
});

var removeAdFormPhotos = function () {
  var photos = photoBox.querySelectorAll('img');
    photos.forEach(function (image) {
    image.remove();
  });
};

var onRoomNumberFieldChange = function () {
  if (adFormCapacity.options.length > 0) {
    [].forEach.call(adFormCapacity.options, function (item) {
      item.selected = VALID_CAPACITY[adFormRoomsNumber.value][SELECTED_ROOM_IMDEX] === item.value;
      item.disabled = VALID_CAPACITY[adFormRoomsNumber.value].indexOf(item.value) === -1;
    });
  }
};

var onTimeInFieldChange = function () {
  adFormCheckOut.options.selectedIndex = adFormCheckIn.options.selectedIndex;
};

var onTimeOutFieldChange = function () {
  adFormCheckIn.options.selectedIndex = adFormCheckOut.options.selectedIndex;
};

var enablePageState = function () {
  map.classList.remove('map--faded');
  pageState = 'enabled';
  adForm.classList.remove('ad-form--disabled');
  mapPinsContainer.appendChild(pinsFragment);
};

var onTypeFieldChange = function () {
  var typeSelectedValue = adFormType.options[adFormType.selectedIndex].value;
  adFormPrice.placeholder = AdTypePrices[typeSelectedValue];
  adFormPrice.min = AdTypePrices[typeSelectedValue];
};

var onButtonResetClick = function () {
  onRoomNumberFieldChange();
  onTypeFieldChange();
  removeAdFormPhotos();
};

var onSuccess = function () {
  removeAdFormPhotos();
  avatar.src = AVATAR_DAFAULT_SRC;
  onRoomNumberFieldChange();
  onTypeFieldChange();
  var successMessage = document.querySelector('.success');
  successMessage.classList.remove('hidden');
  var hideSuccessMessage = function () {
    successMessage.classList.add('hidden');
  };
  setTimeout(hideSuccessMessage, TIMEOUT);
};

var onAdFormSubmit = function (evt) {
  if (onRoomNumberFieldChange.disabled) {
    adFormCapacity.setCustomValidity(VALID_CAPACITY_TEXT);
    return;
  }
  evt.preventDefault();
};

var init = function () {
  adFormType.addEventListener('change', onTypeFieldChange);
  adFormCheckIn.addEventListener('change', onTimeInFieldChange);
  adFormCheckOut.addEventListener('change', onTimeOutFieldChange);
  adFormRoomsNumber.addEventListener('change', onRoomNumberFieldChange);
  changeAdFormFieldsState(ENABLE_FORM_FIELDS);
  buttonReset.addEventListener('click', onButtonResetClick);
  adForm.addEventListener('submit', onAdFormSubmit);
  setAddressFieldValue('dragged');
  adForm.classList.remove('ad-form--disabled');
};

var reset = function () {
  avatar.src = AVATAR_DAFAULT_SRC;
  adFormType.removeEventListener('change', onTypeFieldChange);
  adFormCheckIn.removeEventListener('change', onTimeInFieldChange);
  adFormCheckOut.removeEventListener('change', onTimeOutFieldChange);
  adFormRoomsNumber.removeEventListener('change', onRoomNumberFieldChange);
  adForm.removeEventListener('submit', onAdFormSubmit);
  buttonReset.removeEventListener('click', onButtonResetClick);
  photoInput.removeEventListener('change', createHousingPhotosFragment);
  changeAdFormFieldsState(DISABLE_FORM_FIELDS);
  setAddressFieldValue();
  removeAdFormPhotos();
  adForm.classList.add('ad-form--disabled');
};

addressInput.value = 'x, y';
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
