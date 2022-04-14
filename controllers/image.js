const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'eb3ce54891af4494b278674a6e82f8f8',
});

const handleApiCall = (req, res) => {
  // a list of models from Clarifai can be found at https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json('unable to work with api'));
};

const handleImage = (req, res, knex) => {
  const { id } = req.body;
  knex('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json('unable to get entries'));
};

module.exports = {
  handleImage,
  handleApiCall,
};
