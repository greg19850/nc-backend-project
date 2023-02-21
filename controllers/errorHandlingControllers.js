exports.handleCustomErrors = (err, req, res, next) => {
  if (err === 'Invalid sort query') {
    res.status(400).send({ msg: 'Invalid sort query parameters' });
  } else if (err === 'Invalid order query') {
    res.status(400).send({ msg: 'Invalid order query parameters' });
  } else {
    next(err);
  }
};

exports.handle500Status = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: 'Server Error!' });
};