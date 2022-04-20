const express = require('express');
// install bcrypt-nodejs via npm (it's deprecated but it's okay for this project)
// bcrypt lets us hash passwords and compare hashes
const bcrypt = require('bcrypt-nodejs');
// install the middleware cors to solve 'Access-Control-Allow-Origin' error in the console
const cors = require('cors');
// connect to our postgres database via the npm package knex
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'postgresql-opaque-23345', // localhost
    port: 5432,
    user: 'karyhuang',
    password: '',
    database: 'smart-brain',
  },
});

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
app.use(express.json()); // without this, /signin route will fail
app.use(cors());

/*
ENDPOINTS:
/ --> res = this is working
/signin --> POST = sucess/fail; use POST instead of GET because we want to send the creds via http request body instead of a query string in the URL, to avoid man in the middle attacks thus more secure
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/

app.get('/', (req, res) => {
  res.send('this is working'); // .send responds with a string
});

app.get('/users', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, knex, bcrypt);
});

app.post('/register', (req, res) => {
  register.handleRegister(req, res, knex, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, knex);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, knex);
});

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`hi kary this is port ${process.env.PORT}`);
});
