const express = require('express');
const { getTopics } = require('./controllers/newsControllers');
const { handle500Status } = require('./controllers/errorHandlingControllers');


const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.use(handle500Status);

module.exports = app;