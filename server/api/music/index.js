'use strict';

var express = require('express');
var controller = require('./music.controller');

var router = express.Router();

router.get('/:genre', controller.getRandomSongByGenre);
router.get('/populate', controller.populate);


module.exports = router;