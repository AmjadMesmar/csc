'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const logger = require('./middlewares/logger');
const app = express();



// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
// const v1Router = require('./routes/v1');
const authRouter = require('./auth/routes');



// App Level MW
app.use(cors());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Routes
app.get('/test', (req, res) => {
  res.send('Hello Word! :)');
});
app.get('/', (req, res) => {
  res.send('CSC API!!');
});
app.use('/auth',authRouter);
// app.use('/api/v1',v1Router);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  app: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};

