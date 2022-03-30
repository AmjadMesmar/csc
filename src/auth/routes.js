'use strict';

const express = require('express');
const authRouter = express.Router();

const authenticateBasic = require('./middlewares/basic');
const authenticateBearer = require('./middlewares/bearer');
const { signUpHandler, signInHandler, signoutHandler, refreshHandler, updateUserPasswordHandler, getAllUsersHandler,getUserHandler} = require('./controllers/authControllers');


// Auth Routes
authRouter.post('/signup', signUpHandler);  //Sign Up
authRouter.post('/signin', authenticateBasic, signInHandler); //sign In
authRouter.get('/signout', authenticateBearer, signoutHandler); //Sign Out
authRouter.get('/users', authenticateBearer,getAllUsersHandler); // Get all users
authRouter.get('/user', authenticateBearer,getUserHandler); // Get user's details
authRouter.put('/user/password', authenticateBearer, updateUserPasswordHandler); // Cahange user's password
authRouter.post('/refresh', refreshHandler); // Refresh user's tokens


authRouter.get('/test', authenticateBearer, (req, res, next) => {
  try {
    res.json(req.user);
  } catch (e) {
    next(e.message);
  }
});

module.exports = authRouter;
