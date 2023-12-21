import {frontendUrl, ROUTES} from '../../config.js';
import {goToPage} from '../../modules/router.js';
import {STORAGE} from '../../modules/storage.js';
import {renderPopUpWindow} from '../PopUpWindow/popup_window.js';
import {API} from "../../modules/api.js";

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode(parseInt(p1, 16))
  }))
}

function utf8_to_b64( str ) {
  return window.btoa(unescape(encodeURIComponent( str )));
}

/**
 * Функция для рендеринга меню с инструментами автора опроса.
 * Если пользователь не авторизован, ничего не происходит.
 *
 * @function
 * @return {void}
 */
export const renderAuthorMenu = async() => {
  if (!STORAGE.user) {
    return;
  }
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = Handlebars.templates.authorMenu();

  let parkingsDiv = document.querySelector('#user-park-container');
  for (let index =  0; index < STORAGE.user.parkings.length; ++index) {
    let button = document.createElement('button');
    let userParkingDiv = document.createElement('div');
    button.textContent = STORAGE.user.parkings[index].address;
    button.classList.add("primary-button");
    button.id = `user_parking_button_${index}`;
    userParkingDiv.id = `user_parking_div_${index}`;
    parkingsDiv.appendChild(button);
    parkingsDiv.appendChild(userParkingDiv);

    button.addEventListener('click', (e) => {
      if (button.classList.contains('open')) {
        userParkingDiv.innerHTML = '';
        button.classList.remove('open');
        button.classList.add('close');
        return;
      }
      button.classList.remove('close');
      button.classList.add('open');
      userParkingDiv.innerHTML = '';
      userParkingDiv.innerHTML = Handlebars.templates.parking_info({parking: STORAGE.user.parkings[index]});

    });

  }



  let flagClosed = false;
  const closeButton = document.querySelector('#author-menu-close-button');
  closeButton.addEventListener('click', () => {
    const menu = document.querySelector('.form-author-menu');
    if (flagClosed) {
      menu.classList.add('form-author-menu__open');
      menu.classList.remove('form-author-menu__close');
      flagClosed = false;
    } else {
      menu.classList.remove('form-author-menu__open');
      menu.classList.add('form-author-menu__close');
      flagClosed = true;
    }
  });

};
