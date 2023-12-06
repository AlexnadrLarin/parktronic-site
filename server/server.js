// import express from 'express';
// import path from 'path';
//
// const app = express();
// const PORT = process.env.PORT || 8000;
// // const HOSTNAME_BACKEND = process.env.HOSTNAME_BACKEND || 'http://localhost:8080';
//
// const __dirname = path.resolve();
// app.use('/', express.static(path.resolve(__dirname, './public')));
//
//
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, './public', 'index.html'));
// });
//
// app.listen(PORT, () => console.log(`Server listening port ${PORT}`));

import express from 'express';
import body from 'body-parser';
import cookie from 'cookie-parser';
import morgan from 'morgan';
import {uuid} from 'uuidv4';
import path from 'path';
const app = express();

const __dirname = path.resolve();
app.use('/', express.static(path.resolve(__dirname, './public')));

app.use(morgan('dev'));
app.use(body.json());
app.use(cookie());


const parkings = [
  {
    coords: [55.767808, 37.686204],
    address: '2-я Бауманская, 3',
    free_lots: 7,
    all_lots: 30,
  },
  {
    coords: [55.75578, 37.61786],
    address: 'проезд Воскресенские Ворота',
    free_lots: 7,
    all_lots: 30,
  },
]

const users = {
  'ss@ss.ru': {
    name: 'Алекс',
    username: 'user',
    email: 'aa@aa.ru',
    password: 'password',
    parkings: [parkings[0], parkings[1]],
  },
};

const ids = {};
app.get('/is_authorized', (req, res) => {
  const id = req.cookies['podvorot'];
  const emailSession = ids[id];

  if (!emailSession || !users[emailSession]) {
    return res.status(401).json({error: 'Пользователь не авторизован!'});
  }


  const currentUser = users[emailSession]
  res.status(200).json({id, currentUser});
});

app.post('/login',  (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  if (!password || !email) {
    return res.status(401).json({error: 'Не указан E-Mail или пароль.'});
  }
  if (!users[email] || users[email].password !== password) {
    return res.status(401).json({error: 'Не указан E-Mail или пароль.'});
  }

  const id = uuid();
  ids[id] = email;

  const authorizedUser = users[email]

  res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
  res.status(200).json({id, currentUser: authorizedUser});
});

app.post('/signup', (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const repeat_password = req.body.repeat_password;
  const parkings = []

  const id = uuid;
  const user = {name, username, email, password, parkings};
  ids[id] = email;
  users[email] = user;

  res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
  res.status(201).json({id});
});

app.get('/get_parkings', (req, res) => {
  const id = req.cookies['podvorot'];
  const emailSession = ids[id];

  if (!emailSession || !users[emailSession]) {
    return res.status(401).json({error: 'Пользователь не авторизован!'});
  }

  res.status(200).json({id, parkings});
});

app.post('/parkings', (req, res) => {
  const id = req.cookies['podvorot'];
  const emailSession = ids[id];
  const parking = req.body.parking;

  if (!emailSession || !users[emailSession]) {
    return res.status(401).json({error: 'Пользователь не авторизован!'});
  }

  users[id].parkings.push(parking);

  res.status(200).json({id, parkings});
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening port ${PORT}`));