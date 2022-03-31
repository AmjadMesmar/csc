'use strict';

const { createToken, deleteToken } = require('../models/jwt');
const {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
  getAllUsers,
  getUserInfo,
  updateUser,
  deleteUser,
  getUserDetails,
} = require('../models/user');
const { authenticateWithToken } = require('../models/helpers');
const { validateEmail, checkPassword } = require('./helpers');

const signUpHandler = async (req, res, next) => {
  try {
    let email = req.body.email.toLowerCase().trim(); 
    let password = req.body.password;
    let username = req.body.user_name.toLowerCase().trim();

    /* Check if entered username or email already exists in the database, If none of the exists, create a new user with the given user_name and email to the database, else throw an error: */
    let user = await getUserByEmail(email,username);

    if (!email || !password || !username) {
      res.status(403).json({
        status: 403,
        message: 'Missing parameters, please fill all the required fields!',
      });

    }

    // Check if entered username has spaces:

    else if (username.includes(' ')) {
      res.status(403).json({
        status: 403,
        message: 'Username should not have spaces',
      });
    }

    // Check if entered email format is valid:

    else if (!validateEmail(email)) {
      res.status(403).json({
        status: 403,
        message: 'The email is not valid',
      });
    }

    else if (!user) {
      user = await createUser(req.body);
      let userId = user.id;
      let userTokens = await createToken(userId);

      // Delete token id, user_id and creation date before returning the tokens from data base for security measures: 
      delete userTokens.id;
      delete userTokens.user_id;
      delete userTokens.created_at;
      res.status(200).json(userTokens);
    }
    else {
      res.status(403).json({
        status: 403,
        message: 'UserName or email already taken!',
      });
    }
  } catch (e) {
    next(e);
  }
};

// This handler is used for updating the user's password:
const updateUserPasswordHandler = async (req, res, next) => {
  try {

    const oldPassword = req.body.old_password;
    const newPassword = req.body.new_password;
    const newPassword2 = req.body.new_password2;

    let user = await getUserById(req.user.id);
    const valid = await checkPassword(oldPassword, user.hashed_password);

    if (!oldPassword || !newPassword || !newPassword2) {
      res.status(403).json({
        status: 403,
        message: 'Missing parameters, please enter all required fields!',
      });
    }

    else if (newPassword !== newPassword2) {
      res.status(403).json({
        status: 403,
        message: 'New password mismatch! please write the same new password in both fields!',
      });
    }

    else if (valid) {
      user = await updateUserPassword(user.id, newPassword);
      res.status(200).json({
        status: 200,
        message: 'Password updated successfully!',
      });
    }
    else {
      res.status(403).json({
        status: 403,
        message: 'Old password is incorrect!',
      });
    }
  } catch (e) {
    next(e);
  }
};


// This handler is to return user access and refresh tokens on signin request:

const signInHandler = async (req, res, next) => {
  try {
    delete req.tokens.created_at;
    res.status(200).json(req.tokens);
  } catch (e) {
    next(e);
  }
};

// This handler is to delete the user's access and refresh tokens on sign out request:
const signoutHandler = async (req, res, next) => {
  try {
    await deleteToken(req.user.id);
    res.status(200).json({
      status: 200,
      message: 'Successfully logged out',
    });
  } catch (e) {
    next(e);
  }
};

// This handler is used to get new tokens for the user:
const refreshHandler = async (req, res, next) => {
  try {
    const user = await authenticateWithToken(req.body.refresh_token, 'refresh');
    if (user) {
      await deleteToken(user.id);
      const newTokens = await createToken(user.id);
      delete newTokens.id;
      delete newTokens.user_id;
      res.status(200).json(newTokens);
    }
    else {
      res.status(403).json({
        status: 403,
        message: 'Invalid token!',
      });
    }
  } catch (e) {
    next(e);
  }
};

// Get all users
const getAllUsersHandler = async (req, res, next) => {
  try {
    let allUsers = await getAllUsers();
    let users = allUsers.length;
    return res.status(200).json({ users, allUsers });

  }
  catch (e) {
    next(e);
  }
};

// Get user details
const getUserHandler = async (req, res, next) => {
  try {
    let user = await getUserDetails(req.user.id);
    return res.status(200).json({ user });

  }
  catch (e) {
    next(e);
  }
};

const getUserDetailsHandler = async (req, res, next) => {
  try {
    let user = await getUserInfo(req.params.userID);
    return res.status(200).json({ user });

  }
  catch (e) {
    next(e);
  }
};


// Update user details
const UpdateUserHandler = async (req, res, next) => {
  try {
    let user = await updateUser(req.body,req.params.userID);
    return res.status(200).json({      
      status: 200,
      message: 'User informations has been updated!',
      user: user });
  }
  catch (e) {
    next(e);
  }
};

// Delete user
const DeleteUserHandler = async (req, res, next) => {
  try {
    await deleteUser(req.params.userID);
    return res.status(200).json({
      status: 200,
      message: 'User has been removed!' });

  }
  catch (e) {
    next(e);
  }
};


module.exports = {
  signUpHandler,
  signInHandler,
  signoutHandler,
  refreshHandler,
  updateUserPasswordHandler,
  getAllUsersHandler,
  getUserHandler,
  getUserDetailsHandler,
  UpdateUserHandler,
  DeleteUserHandler,
};
