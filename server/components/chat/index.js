'use strict';

var redisLib = require("redis");
var PlayerSocket = require('./player.js'); 

module.exports = function (appSocket) {
  redisLib.createClient().flushall();

  appSocket.on('connection', function (socket) {
    var playerSocket = new PlayerSocket(socket);
  });
};