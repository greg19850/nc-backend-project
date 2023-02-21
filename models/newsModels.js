const db = require('../db/connection');

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`)
    .then((result) => {

      return result.rows;
    });
};

exports.fetchArticles = (sort_by, order) => {

  if (sort_by && !['created_at'].includes(sort_by)) {
    return Promise.reject('Invalid sort query');
  }

  if (order && !['ASC', 'DESC'].includes(order)) {
    return Promise.reject('Invalid order query');
  }

  let queryString = `SELECT articles.*, COUNT(comments.comment_id) as comment_count
  FROM articles
  LEFT JOIN comments 
  ON comments.article_id = articles.article_id
  GROUP BY articles.article_id`;

  if (sort_by && order) {
    queryString += ` ORDER BY ${sort_by} ${order}`;
  }

  return db.query(queryString)
    .then((result) => {

      return result.rows;
    });
};

exports.fetchCommentsByArticleId = (id) => {
  return db.query();
};