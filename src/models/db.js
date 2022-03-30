/* eslint-disable no-unused-vars */
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;   // calling DATABASE_URL from env variables

// Adding DATABASE_YRL for Heroku

// const client = new Client({ connectionString: DATABASE_URL,ssl: { rejectUnauthorized: false } });

// Adding DATABASE_URL for localhost

const client = new Client(DATABASE_URL);



module.exports = client;