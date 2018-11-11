/**
 * API Server setup
 * 
 */

// Dependencies
const express = require('express');
const Levels = require('../../lib/reques_handlers/levels');

const router = express.Router();

router.get('/', Levels.getAll);
router.get('/:id', Levels.get);
router.put('/:id', Levels.put);

module.exports = router
