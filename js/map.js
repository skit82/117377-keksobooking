var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var OFFERS_COUNT = 8;
var TITLES = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];

var getItrValue = function (arr) {
  var randomIndex = getRandomNumber (0, arr.length - 1);
  return arr[randomIndex];
}

var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var getRandomArrayElements = function () {
  var elements = [];
  for (var i = 0; i < features.length; i++) {
    if (Math.random() > 0.5) {
      elements.push(features[i]);
    }
  }
  return elements;
}

var createOffer = function (i) {
  var locationX = getRandomNumber(300, 900);
  var locationY = getRandomNumber(130, 630);
  return {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
    }
    offer: {
      title: titles[i],
      type: getItrValue (type),
      address: locationX + ',' + locationY,
      price: getRandomPrice (1000, 1000000),
      features: getRandomArrayElements (),
      rooms: getRandomRoom (1, 5),
      guests: getRandomGuests (1, 25),
      checkin: getItrValue (checkins),
      checkout: getItrValue (checkouts),
      description: '',
      photos: [],
    },
    location: {
      x: locationX,
      y: locationY
    }
  }
}

var getOffers = function () {
  var offers = [];
  for ( var i = 0; i < 8; i++) {
    getOffers (i);
    offers.push(createOffer(i));
  }
  return offers;
}


var cityMap = document.querySelector('.map');
function hideMap () {
cityMap.classlist.remove('.map--faded');
}
hideMap ();
