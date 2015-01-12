'use strict';

var express = require('express');
var controller = require('./chat.controller');

var router = express.Router();


router.post('/channel', controller.joinChannel);
router.get('/channel', controller.getChannel);
router.get('/reset', controller.reset);

module.exports = router;