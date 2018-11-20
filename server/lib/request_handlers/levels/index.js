/**
 * Request handlers for the levels route
 *
 */

// Dependencies
const uuidv4 = require('uuid/v4');
const _data = require('../../data');
const { to } = require('../../helpers');
const { ApplicationError } = require('../../error_handling');

const handlers = {};

handlers.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApplicationError(400, 'Level ID not provided.');
    }

    const [error, response] = await to(_data.read('levels', id));

    if (error) {
      throw new ApplicationError(500, error.message);
    }

    res.send(response);
  } catch (e) {
    next(e);
  }
};

handlers.getAll = async (req, res, next) => {
  try {
    const [error, response] = await to(_data.readAll('levels'));

    if (error) {
      throw new ApplicationError(500, error.message);
    }

    res.send(response.map(el => ({ id: el.id, name: el.name })));
  } catch (e) {
    next(e);
  }
};

handlers.put = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApplicationError(400, 'Level ID not provided.');
    }

    const [error, response] = await to(_data.update('levels', id, req.body));

    if (error) {
      throw new ApplicationError(500, error.message);
    }

    res.send(response);
  } catch (e) {
    next(e);
  }
};

handlers.post = async (req, res, next) => {
  try {
    const id = uuidv4().toString();

    const [error, response] = await to(_data
      .create('levels', id, { id, ...req.body }));

    if (error) {
      throw new ApplicationError(500, error.message);
    }

    res.send(response);
  } catch (e) {
    next(e);
  }
};

module.exports = handlers;
