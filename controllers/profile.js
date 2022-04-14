const handleProfileGet = (req, res, knex) => {
  const { id } = req.params;
  knex
    .select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      // because an empty array is technically true, so we must check the length of array to determine if the user exists, otherwise it will return an empty array with status 200
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('user not found');
      }
    })
    .catch((err) => res.status(400).json('error getting user'));
};

module.exports = {
  handleProfileGet,
};
