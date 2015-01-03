var EventEmitter = require("events").EventEmitter;

function Events () {
  this.ee = new EventEmitter();
}

Events.prototype.on = function(e, callback) {
  this.ee.on(e, callback);
};

Events.prototype.emit = function(e, data) {
  this.ee.emit(e, data);
};

module.exports = new Events();