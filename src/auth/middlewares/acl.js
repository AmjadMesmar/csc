/* eslint-disable no-unused-vars */
'use strict';
const client = require('../../models/db');

// This Middleware will check if the user is an admin or not before authorizing:

function adminCheck(req, res, next) {
  if (req.user.is_admin) {
    next();
  } else {
    const error = new Error('User unauthorized, access denied!');
    error.statusCode = 403;
    throw error;
  }
}

module.exports = {
  adminCheck,
};
