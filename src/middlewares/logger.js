'use strict';

// A middleware that log the used method in the API:

module.exports = (req, res, next) => {
  console.log('Request info:', req.method, req.path);
  next();
};