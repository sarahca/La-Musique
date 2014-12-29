'use strict';

var express = require('express');
var controller = require('./chat.controller');

var router = express.Router();

// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

router.post('/channel', controller.joinChannel);
router.get('/channel', controller.getChannel);

module.exports = router;