const { fetchTopics, fetchArticles } = require('../models/newsModels');

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  }).catch((err) => {
    next(err);
  });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  fetchArticles(sort_by, order).then((articles) => {
    res.status(200).send({ articles });
  }).catch((err) => {
    next(err);
  });
};