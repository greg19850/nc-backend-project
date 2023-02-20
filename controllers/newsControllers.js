const { fetchTopics } = require('../models/newsModels');

exports.getTopics = (req, res) => {

  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};