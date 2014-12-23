'use strict';

redis_lib.createClient().flushall();

var PlayerSocket = require('./player.js'); 

io.on('connection', function (socket) {
  var playerSocket = new PlayerSocket(socket);
});

module.exports = null;