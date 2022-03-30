'use strict';

const { authenticateWithToken } = require('../models/helpers');
const { getTokenRecord } = require('../models/jwt');

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return _authError();
    }

    const token = req.headers.authorization.split(' ').pop();

    const tokenRecord = await getTokenRecord(token, 'access');

    if (!tokenRecord) {
      res.status(403).json({
        status: 403,
        message: 'Token is invalid or does not exist!',
      });
    }
    else {

      const validUser = await authenticateWithToken(token, 'access');
      req.user = validUser;
      next();
    }

  } catch (e) {
    next(e);
  }

  function _authError() {
    res.status(403).send('Header authorization is not provided');
  }

};
