'use strict';

/**
 * Module dependencies
 */
const dashboard = require('../controllers/dashboard.server.controller');

module.exports = function (app) {

  app.route('/api/dashboard')
    .get(dashboard.list);
};
