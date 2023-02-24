exports.handlePSQL400Errors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid Path Request' });
  } else if (err.code === '23502') {
    res.status(400).send({ msg: 'Comment body empty!' });
  } else if (err.code === '23503') {
    res.status(404).send({ msg: 'Data not found' });
  } else {
    next(err);
  }
};


exports.handleCustomErrors = (err, req, res, next) => {
  if (err === 'Invalid sort query') {
    res.status(400).send({ msg: 'Invalid sort query parameters' });
  } else if (err === 'Invalid order query') {
    res.status(400).send({ msg: 'Invalid order query parameters' });
  } else if (err === 'Invalid topic query') {
    res.status(400).send({ msg: 'Invalid topic query parameters' });
  } else if (err === 'could not find article') {
    res.status(404).send({ msg: 'Article Not Found!' });
  } else if (err === 'Invalid data type') {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err === 'could not find comment') {
    res.status(404).send({ msg: 'Comment Not Found!' });
  } else {
    next(err);
  }
};

exports.handle500Status = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: 'Server Error!' });
};