const express = require('express');
const { getTopics, getArticles, getArticleById, getCommentsByArticleId, addCommentToArticle, addVotesToArticle, getUsers, deleteComment, getAllEndpoints } = require('./controllers/newsControllers');
const { handlePSQL400Errors, handle500Status, handleCustomErrors } = require('./controllers/errorHandlingControllers');


const app = express();

app.use(express.json());

app.get('/api', getAllEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.get('/api/users', getUsers);

app.post('/api/articles/:article_id/comments', addCommentToArticle);

app.patch('/api/articles/:article_id', addVotesToArticle);

app.delete('/api/comments/:comment_id', deleteComment);

app.use('*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use(handlePSQL400Errors);
app.use(handleCustomErrors);
app.use(handle500Status);

module.exports = app;