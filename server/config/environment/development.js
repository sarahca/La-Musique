'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/lamusique-dev'
  },

  redis: {
    hostname: 'localhost'
  },

  seedDB: true
};
