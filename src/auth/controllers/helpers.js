/* eslint-disable no-unused-vars */
'use strict';

const bcrypt = require('bcrypt');

// This function is used to check if the email's format is correct:

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/* This function check if the password is written in the correct format, 
It shall include letters an numbers with at least 1 Capital letter, 1 small letter and 1 special character: */

function validatePassword(password) {
  const regularExpression =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  return regularExpression.test(password);
}

// This function is used to compare if the entered password equals the hashed password :

async function checkPassword(password, encryptedPassword) {
  try {
    const valid = await bcrypt.compare(password, encryptedPassword);
    return valid;
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = {
  validateEmail,
  validatePassword,
  checkPassword,
};
