'use strict';

(function () {
  var template = document.querySelector('template');
  var map = document.querySelector('.map');
  var pinTemplate = template.content.querySelector('.map__pin');

  var makePinItem = function (ad) {
    var pinItem = pinTemplate.cloneNode(true);
    var pinAvatar = pinItem.querySelector('img');

    pinItem.style.left = ad.location.x + 'px';
    pinItem.style.top = ad.location.y + 'px';
    pinAvatar.src = ad.author.avatar;
    pinAvatar.alt = ad.offer.title;

    pinItem.addEventListener('click', function () {
      if (map.querySelector('.map__card')) {
        window.card.onCloseCardItemClick();
      }
      window.card.openCardItem(ad);
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

  window.pin = {
    renderPins = renderPins
  };
})();
