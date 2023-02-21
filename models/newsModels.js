const db = require('../db/connection');

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`)
    .then((result) => {

      return result.rows;
    });
};

exports.fetchArticles = () => {
  return db.query(
    `SELECT articles.*, COUNT(comments.comment_id) as comment_count
    FROM articles
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `)
    .then((result) => {

      return result.rows;
    });
};