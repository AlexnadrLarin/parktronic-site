import {backendUrl, ROUTES_API} from '../config.js';

const GET_METHOD = 'GET';
const POST_METHOD = 'POST';
const DELETE_METHOD = 'DELETE';
const PUT_METHOD = 'PUT';

export class API {
  /**
   * Проверяет, является ли пользователь авторизованным.
   *
   * @async
   * @function
   // eslint-disable-next-line max-len
   * @return {Promise<{isAuthorized: boolean,
   * authorizedUser: ({password: *, name: *, email: *, username: *} | null)}>} Объект* с информацией
   * о статусе авторизации и о пользователе.
   * @throws {Error} Если произошла ошибка при запросе или обработке данных.
   */
  async isAuth() {
    try {
      const url =  ROUTES_API.isAuth.url;

      const res = await fetch(url, {
        method: GET_METHOD,
        credentials: 'include',
      });

      const body = await res.json();
      let isAuthorized = false;
      let authorizedUser;

      if (res.ok) {
        isAuthorized = true;
        authorizedUser = body.currentUser;
      }

      return {isAuthorized, authorizedUser};
    } catch (e) {
      console.log('Ошибка метода isAuth:', e);
      throw (e);
    }
  }

  /**
   * Функция для авторизации пользователя.
   *
   * @async
   * @function
   * @param {string} email - Почта.
   * @param {string} password - Пароль.
   * @return {Promise<{message: string,
   * authorizedUser: ({password: *, name: *, email: *, username: *} | null)}>} Объект с информацией
   * о статусе авторизации и о пользователе.
   * @throws {Error} Если произошла ошибка при запросе или обработке данных.
   */
  async userLogin(email, password) {
    try {
      const url =  ROUTES_API.login.url;

      const res = await fetch(url, {
        method: POST_METHOD,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({email, password}),
      });

      const body = await res.json();

      let message = 'Ошибка сервера. Попробуйте позже.';

      if (res.status === 400) {
        message = 'Невозможно выполнить вход. Завершите предыдущую сессию!';
      }
      if (res.status === 401) {
        message = 'Неправильный логин или пароль';
      }
      if (res.status === 200) {
        message = 'ok';
      }
      return {message, authorizedUser: body.currentUser};
    } catch (e) {
      console.log('Ошибка метода userLogin:', e);
      throw (e);
    }
  }

  /**
   * Функция для выхода из аккаунта пользователя.
   *
   * @async
   * @function
   * @return {Promise<{message: string}>} - статус выхода из аккаунта.
   * @throws {Error} Если произошла ошибка при запросе или обработке данных.
   */
  async userLogout() {
    try {
      const url = ROUTES_API.logout.url;

      const res = await fetch(url, {
        method: POST_METHOD,
        credentials: 'include',
      });

      if (res.status === 404) {
        return {message: 'Вы не авторизованы, обновите страницу'};
      }
      if (res.status === 408) {
        return {message: 'Потеряно соединение с сервером'};
      }

      return {message: 'ok'};
    } catch (e) {
      console.log('Ошибка метода userLogout:', e);
      throw (e);
    }
  }

  /**
   * Функция для регистрации пользователя.
   *
   * @async
   * @function
   * @param {string} first_name - Имя.
   * @param {string} username - Имя пользователя.
   * @param {string} email - Почта.
   * @param {string} password - Пароль.
   * @param {string} avatar - Аватар пользователя в формате Base64.
   * @return {Promise<{registeredUser: ({password: *, name: *, email: *, username: *} | null),
   * message: string}>} Объект с информацией о статусе регистрации и о пользователе.
   * @throws {Error} Если произошла ошибка при запросе или обработке данных.
   */
  // eslint-disable-next-line camelcase
  async userSignup(first_name, username, email, password, avatar = '') {
    try {
      const url =  ROUTES_API.signup.url;

      const res = await fetch(url, {
        method: POST_METHOD,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          // eslint-disable-next-line camelcase
          first_name, username, email, password, avatar,
        }),
      });

      const body = await res.json();

      const registeredUser = body.data;
      let message = 'Ошибка сервера. Попробуйте позже.';

      if (res.status === 409) {
        message = 'Пользователь уже существует';
      }
      if (res.status === 400) {
        message = 'Невозможно зарегистрироваться. Завершите предыдущую сессию!';
      }
      if (res.ok) {
        message = 'ok';
      }

      return {message, registeredUser};
    } catch (e) {
      console.log('Ошибка метода userSignup:', e);
      throw (e);
    }
  }


  /**
   * Функция для получения ДАННЫХ парковок.
   *
   * @async
   * @function
   * @return {Promise<{parkings: *, message: string}>} Объект с массивом парковок.
   * @throws {Error} Если произошла ошибка при запросе или обработке данных.
   */
  async getParkings() {
    try {
      let url =  ROUTES_API.get_parkings.url;

      const res = await fetch(url, {
        method: GET_METHOD,
        credentials: 'include',
      });

      const body = await res.json();

      if (res.ok) {
        const parkings = body.parkings;
        return {message: 'ok', parkings};
      }

      return {message: 'Ошибка сервера. Попробуйте позже', forms: null};
    } catch (e) {
      console.log('Ошибка метода getParkings:', e);
      throw (e);
    }
  }

  /**
   * Функция для добавления парковки в избранное для пользователя.
   *
   * @async
   * @function
   * @param {Object} parking - Данные о парковке.
   * @return {Promise<{parkings: *, message: string}>} Объект с массивом парковок.
   * @throws {Error} Если произошла ошибка при запросе или обработке данных.
   */
  async addParking(parking) {
    try {
      const url = ROUTES_API.post_parkings.url;

      const res = await fetch(url, {
        method: POST_METHOD,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          // eslint-disable-next-line camelcase
          parking,
        }),
      });

      if (res.status === 401) {
        return {message: 'Вы не авторизованы'};
      }

      const body = await res.json();

      if (res.ok) {
        const parkings = body.parkings;
        return {message: 'ok', parkings};
      }

    } catch (e) {
      console.log('Ошибка метода addParking:', e);
      throw (e);
    }
  }
}
