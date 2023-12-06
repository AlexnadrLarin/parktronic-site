import {goToPage} from "../../../modules/router.js";
import {ROUTES} from "../../../config.js";
import {STORAGE} from "../../../modules/storage.js";

/**
 * Функция для рендеринга главной страницы с информацией о сервисе.
 *
 * @function
 * @return {void}
 */
export const renderMain = () => {
  if (STORAGE.user) {
    goToPage(ROUTES.parkings);
    return;
  }
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';
  rootElement.innerHTML = Handlebars.templates.main();

  const formsButton = document.querySelector('#index-forms-button');
  formsButton.addEventListener('click', () => {
    goToPage(ROUTES.parkings);
  });
  const signupButton = document.querySelector('#index-signup-button');
  signupButton.addEventListener('click', () => {
    goToPage(ROUTES.signup);
  });
};
