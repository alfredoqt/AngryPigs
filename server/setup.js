/**
 * API Server setup
 * 
 */

// Dependencies
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { ApplicationError } = require('./lib/error_handling');

const levelRouter = require('./routes/levels');

function route(app) {
  app.use('/angry-pigs/levels', levelRouter);
}

function setup() {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('dev'))
  // Serve static files
  app.use('/angry-pigs',express.static('game'));
  app.use('/angry-pigs/editor',express.static('editor'));


  route(app);

  // Error Handling middleware
  app.use((err, req, res, next) => {
    if (err instanceof ApplicationError) {
        return res.status(err.status).send({ status: err.status, message: err.message });
    }
    next(err);
  });

  app.listen(5010, () => console.log(`Listening on port ${5010}`));
}

module.exports = setup;
