import {API} from '../../../modules/api.js';
import {ROUTES} from '../../../config.js';
import {removeMessage, renderMessage} from '../../Message/message.js';
import {goToPage} from '../../../modules/router.js';
import {STORAGE} from '../../../modules/storage.js';
import {renderSideBarMenu} from "../../SideBarMenu/sideBarMenu.js";


const init = async () => {
  try {
    const api = new API();
    const isParkings = await api.getParkings();
    if (isParkings) {
      STORAGE.parkings = isParkings.parkings;
    }
  } catch (e) {
    if (e.toString() === 'TypeError: Failed to fetch') {
      renderMessage('Потеряно соединение с сервером', true);
    }
  }

  let myMap = new ymaps.Map('map', {
    center: [55.70578, 37.61786],
    zoom: 11,
  });

  myMap.controls.remove('searchControl'); // удаляем поиск
  myMap.controls.remove('trafficControl'); // удаляем контроль трафика
  myMap.controls.remove('typeSelector'); // удаляем тип
  myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим

  if (STORAGE.parkings) {
    for (let index = 0; index < STORAGE.parkings.length; ++index) {
      myMap.geoObjects.add(new ymaps.Placemark(STORAGE.parkings[index].coords, {
        hintContent: STORAGE.parkings[index].address,
        balloonContent: `${STORAGE.parkings[index].address}<br>
        Количество свободных мест: ${STORAGE.parkings[index].free_lots.right_side.length
        + STORAGE.parkings[index].free_lots.left_side.length}/${STORAGE.parkings[index].all_lots.left_side.number
        + STORAGE.parkings[index].all_lots.right_side.number}`
      }, {
        preset: 'islands#icon',
        iconColor: '#02006B'
      }))

      const parkingLeftSideBegin = STORAGE.parkings[index].all_lots.left_side.coords[0];

      const leftSideWidth = Math.abs(STORAGE.parkings[index].all_lots.left_side.coords[1][1]
        - STORAGE.parkings[index].all_lots.left_side.coords[0][1]);
      const leftSideHeight = Math.abs(STORAGE.parkings[index].all_lots.left_side.coords[1][0]
        - STORAGE.parkings[index].all_lots.left_side.coords[0][0]);

      const leftSideTan = leftSideHeight / leftSideWidth;

      const leftSideLotWidth = leftSideWidth / STORAGE.parkings[index].all_lots.left_side.number;
      const leftSideLotHeight = leftSideHeight / STORAGE.parkings[index].all_lots.left_side.number;

      const lotHeight = 0.00005166666666648704

      const leftSideLotTanWidth = lotHeight * leftSideTan;

      const parkingRightSideBegin = STORAGE.parkings[index].all_lots.right_side.coords[0];

      const rightSideWidth = Math.abs(STORAGE.parkings[index].all_lots.right_side.coords[1][1]
        - STORAGE.parkings[index].all_lots.right_side.coords[0][1]);
      const rightSideHeight = Math.abs(STORAGE.parkings[index].all_lots.right_side.coords[1][0]
        - STORAGE.parkings[index].all_lots.right_side.coords[0][0]);
      let rightSideTan = rightSideHeight / rightSideWidth;

      const rightSideLotWidth = rightSideWidth / STORAGE.parkings[index].all_lots.right_side.number;
      const rightSideLotHeight = rightSideHeight / STORAGE.parkings[index].all_lots.left_side.number;

      let rightSideLotTanWidth = lotHeight * rightSideTan;

      if (STORAGE.parkings[index].all_lots.left_side.number >= 1) {
        for (let i = 1; i <= STORAGE.parkings[index].all_lots.left_side.number; ++i) {
          let color = "rgba(243,73,73,0.47)";
          if (STORAGE.parkings[index].free_lots.left_side.includes(i)) {
            color = "rgba(91,243,82,0.47)";
          }
          let lotRect = new ymaps.Polygon([
              [
                [parkingLeftSideBegin[0] + (i - 1) * leftSideLotHeight, parkingLeftSideBegin[1] + (i - 1) * leftSideLotWidth],
                [parkingLeftSideBegin[0] + i * leftSideLotHeight, parkingLeftSideBegin[1] + i * leftSideLotWidth],
                [parkingLeftSideBegin[0] + i * leftSideLotHeight + lotHeight, parkingLeftSideBegin[1] + i * leftSideLotWidth - leftSideLotTanWidth],
                [parkingLeftSideBegin[0] + (i - 1) * leftSideLotHeight + lotHeight, parkingLeftSideBegin[1] + (i - 1) * leftSideLotWidth - leftSideLotTanWidth],
              ]
            ],
            {
            },
            {
              fillColor: color,
            }
          );
          myMap.geoObjects.add(lotRect);
        }
      }

      if (STORAGE.parkings[index].all_lots.right_side.number >= 1) {
        for (let i = 1; i <= STORAGE.parkings[index].all_lots.right_side.number; ++i) {
          let color = "rgba(243,73,73,0.47)";
          if (STORAGE.parkings[index].free_lots.right_side.includes(i)) {
            color = "rgba(91,243,82,0.47)";
          }
          let lotRect = new ymaps.Polygon([
              [
                [parkingRightSideBegin[0] + (i - 1) * rightSideLotHeight, parkingRightSideBegin[1] + (i - 1) * rightSideLotWidth],
                [parkingRightSideBegin[0] + i * rightSideLotHeight, parkingRightSideBegin[1] + i * rightSideLotWidth],
                [parkingRightSideBegin[0] + i * rightSideLotHeight - lotHeight, parkingRightSideBegin[1] + i * rightSideLotWidth + rightSideLotTanWidth],
                [parkingRightSideBegin[0] + (i - 1) * rightSideLotHeight - lotHeight, parkingRightSideBegin[1] + (i - 1) * rightSideLotWidth + rightSideLotTanWidth],
              ]
            ],
            {},
            {
              fillColor: color,
            }
          );
          myMap.geoObjects.add(lotRect);
        }
      }

    }
  }

}

/**
 * Функция для рендеринга страницы с созданными пользователем опросами.
 * Если пользователь не авторизован, происходит редирект на страницу входа.
 *
 * @async
 * @function
 * @return {void}
 */
export const renderParkings = async () => {
  removeMessage();

  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';

  renderSideBarMenu();
  rootElement.insertAdjacentHTML('beforeend', Handlebars.templates.parkings());

  // let flagClosed = false;
  // window.onmessage = function(event){
  //   if (event.data === 'storage') {
  //     const sideBarFrame = document.querySelector('.sidebar_iframe');
  //     sideBarFrame.contentWindow.postMessage(STORAGE, "*");
  //   }
  //   if (event.data === 'close') {
  //     const menu = document.querySelector('.sidebar_iframe');
  //     if (flagClosed) {
  //       menu.classList.add('side-bar-menu__open');
  //       menu.classList.remove('side-bar-menu__close');
  //       flagClosed = false;
  //     } else {
  //       menu.classList.remove('side-bar-menu__open');
  //       menu.classList.add('side-bar-menu__close');
  //       flagClosed = true;
  //     }
  //   }
  // };

  ymaps.ready(init);
};

export const debounce = (func, delay) => {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}
