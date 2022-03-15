const express = require('express');
// install bcrypt-nodejs via npm (it's deprecated but it's okay for this project)
// bcrypt lets us hash passwords and compare hashes
const bcrypt = require('bcrypt-nodejs');
// install the middleware cors to solve 'Access-Control-Allow-Origin' error in the console
const cors = require('cors');

const app = express();
app.use(express.json()); // without this, /signin route will fail
app.use(cors());

// just for demo purposes, we create a database variable to store users
// the problem with this is, nodemon restarts every time we change a route, so this database variable also refreshes and will not include any new registered users
const database = {
  users: [
    {
      id: '123',
      name: 'Kary',
      email: 'kary@gmail.com',
      password: 'milktea',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Bret',
      email: 'bret@gmail.com',
      password: 'baguette',
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'kary@gmail.com',
    },
  ],
};

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
  // compare Chloe's pw 'coffee' to the hash bcrypt generated when she submitted this pw
  bcrypt.compare(
    'coffee',
    '$2a$10$Bz25h5GfMF8Dj9Pw8atv5OdDZ4Y5o0NrN3tiBVx0VtUywzODdjs1K',
    function (err, res) {
      console.log('first guess', res); // will output true
    }
  );
  bcrypt.compare(
    'coffeef',
    '$2a$10$Bz25h5GfMF8Dj9Pw8atv5OdDZ4Y5o0NrN3tiBVx0VtUywzODdjs1K',
    function (err, res) {
      console.log('second guess', res); // will output false
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]); // .json responds with json
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash);
  });
  database.users.push({
    id: '125',
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let userFound = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      userFound = true;
      return res.json(user);
    }
  });
  if (!userFound) {
    res.status(400).json('user not found');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let userFound = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      userFound = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!userFound) {
    res.status(400).json('user not found');
  }
});

app.listen(3000, () => {
  console.log('hi kary 3000');
});
