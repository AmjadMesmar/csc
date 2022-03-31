'use strict';

const express = require('express');
const authRouter = express.Router();

const authenticateBasic = require('./middlewares/basic');
const authenticateBearer = require('./middlewares/bearer');
const { signUpHandler, signInHandler, signoutHandler, refreshHandler, updateUserPasswordHandler, getAllUsersHandler,getUserHandler, UpdateUserHandler, DeleteUserHandler,getUserDetailsHandler} = require('./controllers/authControllers');
const {adminCheck} = require('./middlewares/acl');

// Auth Routes
authRouter.post('/signup', signUpHandler);  //Sign Up
authRouter.post('/signin', authenticateBasic, signInHandler); //sign In
authRouter.get('/signout', authenticateBearer, signoutHandler); //Sign Out

authRouter.get('/users', authenticateBearer,adminCheck,getAllUsersHandler); // Get all users
authRouter.get('/user', authenticateBearer,getUserHandler); // Get user's details

authRouter.get('/user/:userID', authenticateBearer,adminCheck,getUserDetailsHandler); // Get user's details
authRouter.put('/user/:userID', authenticateBearer,adminCheck,UpdateUserHandler); // Update user's details
authRouter.delete('/user/:userID', authenticateBearer,adminCheck,DeleteUserHandler); // Delete user

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
