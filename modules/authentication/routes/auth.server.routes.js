'use strict';

/**
 * Module dependenciesverifyEmailController
 */
var passport = require('passport');

module.exports = function(app) {
  // User Routes
  var authentication = require('../controllers/auth.server.controller');

  // Setting up the users password api
  // app.route('/api/auth/forgot').post(users.forgot);
  // app.route('/api/auth/reset/:token').get(users.validateResetToken);
  // app.route('/api/auth/reset/:token').post(users.reset);

  // Setting up the users authentication api
  app.route('/api/auth/signin')
    .post(authentication.signin);
  app.route('/api/auth/signout').get(authentication.signout);

  // app.route('/api/auth/resendVerificationMail').post(authentication.resendVerificationMail);
  // // Setting the ldap oauth routes
  // app.route('/api/auth/verify-email').post(authentication.verifyEmail);

};
