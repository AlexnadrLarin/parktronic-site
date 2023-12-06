import {renderMainLogout} from './components/Logout/logout.js';
import {renderLogin} from './components/pages/Login/login.js';
import {renderParkings} from './components/pages/Parkings/parkings.js';
import {renderMain} from './components/pages/Main/main.js';
import {renderSignup} from './components/pages/Signup/signup.js';


export const ROUTES = {
  main: {
    url: '/',
    state: 'main',
    open: renderMain,
  },
  parkings: {
    url: '/parkings',
    state: 'parkings',
    open: renderParkings,
  },
  signup: {
    url: '/signup',
    state: 'signup',
    open: renderSignup,
  },
  login: {
    url: '/login',
    state: 'login',
    open: renderLogin,
  },
  logout: {
    url: '/logout',
    state: 'main',
    open: renderMainLogout,
  },
};

const domain = 'localhost';
// export const backendUrl = `http://${domain}:8080/api/v1`;
export const backendUrl = `http://${domain}:8000`;
export const frontendUrl = `http://${domain}:8000`;

const GET_METHOD = 'GET';
const POST_METHOD = 'POST';

export const ROUTES_API = {
  login: {
    url: '/login',
    method: POST_METHOD,
  },
  signup: {
    url: '/signup',
    method: POST_METHOD,
  },
  isAuth: {
    url: '/is_authorized',
    method: GET_METHOD,
  },
  logout: {
    url: '/logout',
    method: POST_METHOD,
  },
  get_parkings: {
    url: '/get_parkings',
    method: GET_METHOD,
  },
  post_parkings: {
    url: '/parkings',
    method: POST_METHOD,
  },
};
