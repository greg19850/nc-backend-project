const { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId, checkArticleIdExist, insertNewComment, fetchUpdatedVotes, fetchUsers } = require('../models/newsModels');

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  }).catch((err) => {
    next(err);
  });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchArticles(sort_by, order, topic).then((articles) => {
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

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by } = req.query;

  const checkArticlePromise = checkArticleIdExist(article_id);
  const commentsPromise = fetchCommentsByArticleId(article_id, sort_by);

  Promise.all([commentsPromise, checkArticlePromise]).then(([comments]) => {
    res.status(200).send({ comments });
  }).catch((err) => {
    next(err);
  });
};

exports.addCommentToArticle = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;

  const checkArticlePromise = checkArticleIdExist(article_id);
  const commentsPromise = insertNewComment(newComment, article_id);

  Promise.all([commentsPromise, checkArticlePromise])
    .then(([comment]) => {
      res.status(201).send({ comment });
    }).catch((err) => {
      next(err);
    });
};

exports.addVotesToArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  const checkArticlePromise = checkArticleIdExist(article_id);
  const votesPromise = fetchUpdatedVotes(inc_votes, article_id);

  Promise.all([votesPromise, checkArticlePromise])
    .then(([updatedArticle]) => {
      res.status(200).send({ article: updatedArticle });
    }).catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {

  fetchUsers().then(users => {
    res.status(200).send({ users });
  }).catch((err) => {
    next(err);
  });
};