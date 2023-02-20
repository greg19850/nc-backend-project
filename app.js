const express = require('express');
const { getTopics } = require('./controllers/newsControllers');
const { handle500Status, handleCustomErrors } = require('./controllers/errorHandlingControllers');


const app = express();

app.get('/api/topics', getTopics);
app.use('*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use(handle500Status);

module.exports = app;