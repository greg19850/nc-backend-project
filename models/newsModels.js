const db = require('../db/connection');
const devArticles = require('../db/data/development-data/articles');
const testArticles = require('../db/data/test-data/articles');
const endpointsJSON = require('../endpoints.json');

exports.fetchEndpointsFile = () => {
  return endpointsJSON;
};

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`)
    .then((result) => {

      return result.rows;
    });
};

exports.fetchArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
  const validSortColumns = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url'];
  const validTopics = [];

  devArticles.forEach(devArticle => {
    let devTopic = '';
    for (let key in devArticle) {
      if (key === 'topic') {
        devTopic = devArticle[key];
      }
    }

    if (!validTopics.includes(devTopic)) {
      validTopics.push(devTopic);
    }
  });

  testArticles.forEach(testArticle => {
    let testTopic = '';
    for (let key in testArticle) {
      if (key === 'topic') {
        testTopic = testArticle[key];
      }
    }

    if (!validTopics.includes(testTopic)) {
      validTopics.push(testTopic);
    }
  });


  if (sort_by && !validSortColumns.includes(sort_by)) {
    return Promise.reject('Invalid sort query');
  }

  if (order && !['ASC', 'DESC'].includes(order)) {
    return Promise.reject('Invalid order query');
  }

  if (topic && !validTopics.includes(topic)) {
    return Promise.reject('Invalid topic query');
  }

  let queryString = `SELECT articles.*, COUNT(comments.comment_id) as comment_count
  FROM articles
  LEFT JOIN comments 
  ON comments.article_id = articles.article_id`;
  const queryParams = [];

  if (topic) {
    queryString += ' WHERE topic = $1';
    queryParams.push(topic);
  }

  queryString += ` GROUP BY articles.article_id`;

  if (sort_by && order) {
    queryString += ` ORDER BY ${sort_by} ${order}`;
  }

  return db.query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db.query(
    `SELECT articles.*, COUNT(comments.comment_id) as comment_count
    FROM articles
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id
    WHERE articles.article_id=$1
    GROUP BY articles.article_id
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

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`)
    .then((result) => {
      return result.rows;
    });
};

exports.fetchCommentToDelete = (commentId) => {

  if (commentId !== undefined)
    return db.query(`
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `, [commentId])
      .then((result) => {
        if (result.rowCount === 0) {
          return Promise.reject('could not find comment');
        }

        return result.rows[0];
      });
};