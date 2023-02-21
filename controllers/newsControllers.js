const { fetchTopics, fetchArticles, fetchArticleById } = require('../models/newsModels');

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

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id).then((article) => {
    res.status(200).send({ article });
  }).catch((err) => {
    next(err);
  });
};