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
    coords: [55.765610, 37.686165],
    address: 'Лефортовская набережная',
    free_lots: {
      right_side: [1, 3],
      left_side: [1]
    },
    all_lots: {
      right_side: {
        number: 26,
        coords:[[55.765408, 37.685846], [55.765906, 37.686216]]
      },
      left_side: {
        number: 24,
        coords:[[55.765316, 37.686098], [55.765845, 37.686505]]
      },
    },
  },
  {
    coords: [55.747165, 37.672475],
    address: 'Съезжинский переулок\n',
    free_lots: {
      right_side: [1, 3, 5, 7],
      left_side: [2, 4]
    },
    all_lots: {
      right_side: {
        number: 8,
        coords:[[55.747197, 37.672306], [55.747214, 37.672656]]
      },
      left_side: {
        number: 7,
        coords:[[55.747059, 37.672331], [55.747080, 37.672627]]
      },
    },
  }
]

const users = {
  'ss@ss.ru': {
    name: 'Алекс',
    username: 'user',
    email: 'aa@aa.ru',
    password: 'password',
    parkings: [parkings[0]],
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

app.post('/logout',  (req, res) => {
  const id = req.cookies['podvorot'];
  const emailSession = ids[id];

  if (!emailSession || !users[emailSession]) {
    return res.status(404).json({error: 'Пользователь не авторизован!'});
  }

  res.clearCookie('podvorot');
  res.status(200).json();
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
  // const id = req.cookies['podvorot'];
  // const emailSession = ids[id];
  //
  // if (!emailSession || !users[emailSession]) {
  //   return res.status(401).json({error: 'Пользователь не авторизован!'});
  // }

  res.status(200).json({ parkings});
});

app.post('/add_parkings', (req, res) => {
  const id = req.cookies['podvorot'];
  const emailSession = ids[id];
  const parking = Number(req.body.parking);

  if (!emailSession || !users[emailSession]) {
    return res.status(401).json({error: 'Пользователь не авторизован!'});
  }

  if (!parkings[parking]) {
    return res.status(402).json({error: 'Такой парковки не существует!'});
  }

  if (users[emailSession].parkings[parking]) {
    return res.status(403).json({error: 'Парковка уже добавлена!'});
  }

  users[emailSession].parkings.push(parkings[parking]);

  const currentUser = users[emailSession];

  res.status(200).json({id, currentUser});
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening port ${PORT}`));