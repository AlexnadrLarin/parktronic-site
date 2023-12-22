import {frontendUrl, ROUTES} from '../../config.js';
import {goToPage} from '../../modules/router.js';
import {STORAGE} from '../../modules/storage.js';
import {renderPopUpWindow} from '../PopUpWindow/popup_window.js';
import {API} from "../../modules/api.js";
import {renderMessage} from "../Message/message.js";
import {navbar} from "../Navbar/navbar.js";

/**
 * Функция для рендеринга меню с инструментами автора опроса.
 * Если пользователь не авторизован, ничего не происходит.
 *
 * @function
 * @return {void}
 */
export const renderSideBarMenu = () => {
  if (!STORAGE.user) {
    return;
  }
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = Handlebars.templates.sideBarMenu();

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
      userParkingDiv.innerHTML = Handlebars.templates.parking_info({
        parking:
          {
            free_lots: STORAGE.user.parkings[index].free_lots.left_side.length
                      + STORAGE.user.parkings[index].free_lots.right_side.length,
            all_lots: STORAGE.user.parkings[index].all_lots.left_side.number
                      + STORAGE.user.parkings[index].all_lots.right_side.number,
          }
      });
      let addButton = userParkingDiv.querySelector("#parking-info_button");
      addButton.classList.remove('secondary-button');
      addButton.innerHTML = '';
    });
  }

  document.getElementById("search-icon-button").addEventListener("click", () => {
    let searchValue = document.getElementById("search-input").value;
    let resultsList = document.getElementById("search_result");
    resultsList.innerHTML = "";

    if (searchValue === '') {
      let p = document.createElement('p');
      p.textContent = "Вы ничего не ввели!";
      resultsList.appendChild(p)
      return;
    }

    let counter = 0;
    for (let i = 0; i < STORAGE.parkings.length; i++) {
      let parking = STORAGE.parkings[i];
      if (parking.address.toLowerCase().includes(searchValue.toLowerCase())) {
        counter++;
        let button = document.createElement('button');
        let userParkingDiv = document.createElement('div');
        button.textContent = parking.address;
        button.classList.add("primary-button");
        resultsList.appendChild(button);
        resultsList.appendChild(userParkingDiv);

        button.addEventListener('click', () => {
          if (button.classList.contains('open')) {
            userParkingDiv.innerHTML = '';
            button.classList.remove('open');
            button.classList.add('close');
            addButton.classList.add('display-none');
            return;
          }
          button.classList.remove('close');
          button.classList.add('open');
          userParkingDiv.innerHTML = '';
          userParkingDiv.innerHTML = Handlebars.templates.parking_info({
            parking:
              {
                free_lots: parking.free_lots.left_side.length
                  + parking.free_lots.right_side.length,
                all_lots: parking.all_lots.left_side.number
                  + parking.all_lots.right_side.number,
              }
            });
          let addButton = userParkingDiv.querySelector("#parking-info_button");

          if (addButton) {
            addButton.addEventListener('click', async () => {
              try {
                const api = new API();
                const res = await api.addParking(i);

                if (res.message !== 'ok') {
                  renderMessage(res.message, true);
                  return;
                }

                STORAGE.user = res.currentUser;

                goToPage(ROUTES.parkings);
                renderMessage('Вы успешно добавили парковку в избранное');
              } catch (err) {
                if (err.toString() !== 'TypeError: Failed to fetch') {
                  renderMessage('Ошибка сервера. Попробуйте позже', true);
                  return;
                }
                renderMessage('Потеряно соединение с сервером', true);
              }
            });
          }
        });


      }
    }
    if (counter === 0) {
      let resultsList = document.getElementById("search_result");
      resultsList.innerHTML = "";
      let p = document.createElement('p');
      p.textContent = "Ничего не найдено";
      resultsList.appendChild(p)
    }
  });

  let flagClosed = false;
  const closeButton = document.querySelector('#author-menu-close-button');
  closeButton.addEventListener('click', () => {
    const menu = document.querySelector('.form-author-menu');
    if (flagClosed) {
      menu.classList.add('form-author-menu__open');
      menu.classList.remove('form-author-menu__close');
      closeButton.innerHTML = 'menu_open';
      flagClosed = false;
    } else {
      menu.classList.remove('form-author-menu__open');
      menu.classList.add('form-author-menu__close');
      closeButton.innerHTML = 'menu';
      flagClosed = true;
    }
  });

};