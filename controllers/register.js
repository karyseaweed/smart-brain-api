const handleRegister = (req, res, knex, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission from Register');
  }
  const hash = bcrypt.hashSync(password);
  // use the transaction method when you want to update multiple tables at once
  knex
    .transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into('login')
        // the returning method specifies which column should be returned by the insert, update and delete methods
        .returning('email')
        .then((loginEmail) => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0].email,
              name: name,
              joined: new Date(),
            })
            .then((user) => {
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => res.status(400).json('unable to register'));
};

module.exports = {
  handleRegister,
};
