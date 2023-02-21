const express = require('express');
const { getTopics, getArticles, getCommentsByArticleId } = require('./controllers/newsControllers');
const { handle500Status, handleCustomErrors } = require('./controllers/errorHandlingControllers');


const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.use('*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use(handleCustomErrors);
app.use(handle500Status);

module.exports = app;