import {API} from '../../../modules/api.js';
import {ROUTES} from '../../../config.js';
import {removeMessage, renderMessage} from '../../Message/message.js';
import {goToPage} from '../../../modules/router.js';
import {STORAGE} from '../../../modules/storage.js';
import {renderAuthorMenu} from "../../AuthorMenu/authorMenu.js";


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
    center: [55.75578, 37.61786],
    zoom: 10,
  });

  myMap.controls.remove('searchControl'); // удаляем поиск
  myMap.controls.remove('trafficControl'); // удаляем контроль трафика
  myMap.controls.remove('typeSelector'); // удаляем тип
  myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим

  if (STORAGE.parkings) {
    for (let index =  0; index < STORAGE.parkings.length; ++index) {
      myMap.geoObjects.add(new ymaps.Placemark(STORAGE.parkings[index].coords, {
        hintContent: STORAGE.parkings[index].address,
        balloonContent: `${STORAGE.parkings[index].address}<br>
Количество свободных мест:${STORAGE.parkings[index].free_lots}/${STORAGE.parkings[index].all_lots}`
      }, {
        preset: 'islands#icon',
        iconColor: '#02006B'
      }))
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

  // Проверка авторизации
  if (!STORAGE.user) {
    goToPage(ROUTES.login);
    renderMessage('Вы не авторизованы!', true);
    return;
  }
  const rootElement = document.querySelector('#root');

  renderAuthorMenu();
  rootElement.insertAdjacentHTML('beforeend', Handlebars.templates.parkings());

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
