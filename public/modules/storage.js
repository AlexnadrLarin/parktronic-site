
export let STORAGE = {
  user: null,
  parkings: [],
};

/**
 * Функция очистки информации о текущем пользователе.
 *
 * @function
 * @return {void}
 */
export const clearStorage = () => {
  STORAGE.user = null;
  STORAGE.forms = [];
};


