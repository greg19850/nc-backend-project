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

exports.fetchArticleById = (article_id) => {
  return db.query(
    `SELECT * FROM articles
    WHERE article_id=$1
    `, [article_id]
  ).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject('could not find article');
    }

    return result.rows[0];
  });
};

exports.fetchCommentsByArticleId = (id, sort_by) => {

  if (sort_by && !['created_at'].includes(sort_by)) {
    return Promise.reject('Invalid sort query');
  }

  let queryString = 'SELECT * FROM comments';
  const queryParams = [];

  if (id !== undefined) {
    queryString += ' WHERE article_id = $1';
    queryParams.push(id);
  }

  if (sort_by) {
    queryString += ` ORDER BY ${sort_by}`;
  }

  return db.query(queryString, queryParams)
    .then((result) => {

      return result.rows;
    });
};

exports.checkArticleIdExist = (article_id) => {
  let queryString = 'SELECT * FROM articles';
  const queryParams = [];

  if (article_id !== undefined) {
    queryString += ' WHERE article_id = $1';
    queryParams.push(article_id);
  }

  return db.query(queryString, queryParams).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject('could not find article');
    } else {
      return result.rows[0];
    }
  });
};

exports.insertNewComment = (newComment, article_id) => {


  return db.query(
    `
    INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `, [newComment.author, newComment.body, article_id]).then(result => {
      return result.rows[0];
    });
};

exports.fetchUpdatedVotes = (newVotes, articleId) => {

  if (typeof newVotes !== 'number') {
    return Promise.reject('Invalid data type');
  }

  return db.query(
    `
    UPDATE articles
    SET votes= $1 WHERE article_id = $2
    RETURNING *;
    `, [newVotes, articleId]
  )
    .then((result) => {
      return result.rows[0];
    });
};