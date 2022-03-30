/* eslint-disable no-unused-vars */
'use strict';

const client = require('../../models/db');
const { getToken } = require('../models/helpers');

// This function is used for getting tokens for users and adding them to database:

async function createToken(user_id) {
  try {
    const accessToken = getToken(user_id);
    const refreshToken = getToken(user_id, 'refresh');
    let SQL = `INSERT INTO JWT (access_token,refresh_token,user_id) VALUES ($1,$2,$3) RETURNING *;`;
    let tokenValues = [accessToken, refreshToken, user_id];
    let tokenQuery = await client.query(SQL, tokenValues);
    return tokenQuery.rows[0];
  } catch (e) {
    throw new Error(e);
  }
}

// This function is used for deleting tokens for users:

async function deleteToken(user_id) {
  try {
    let SQL = `DELETE FROM JWT WHERE user_id=$1;`;
    let removeToken = [user_id];
    let tokenQuery = await client.query(SQL, removeToken);
    return tokenQuery;
  } catch (e) {
    throw new Error(e);
  }
}

// This function is used to get user's tokens using user_id:

async function getTokenByUserId(user_id) {
  try {
    let SQL = `SELECT access_token,refresh_token from JWT WHERE user_id=$1;`;
    let getToken = [user_id];
    let tokenQuery = await client.query(SQL, getToken);
    return tokenQuery.rows[0];
  } catch (e) {
    throw new Error(e);
  }
}

// This function is used to get all tokens depending on token type:

async function getTokenRecord(token, type='access') {
  try {
    let SQL = `SELECT * from JWT WHERE access_token=$1;`;
    if(type === 'refresh') SQL = `SELECT * from JWT WHERE refresh_token=$1;`;

    let getToken = [token];
    let tokenQuery = await client.query(SQL, getToken);
    return tokenQuery.rows[0];
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = { createToken, deleteToken, getTokenByUserId, getTokenRecord };
