const express = require('express');
const { getTopics, getArticles, getArticleById } = require('./controllers/newsControllers');
const { handlePSQL400Errors, handle500Status, handleCustomErrors } = require('./controllers/errorHandlingControllers');


const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.use('*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use(handlePSQL400Errors);
app.use(handleCustomErrors);
app.use(handle500Status);

module.exports = app;