'use strict';
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mail = require(path.resolve('./config/lib/mail'));

module.exports.sendEmail = function (user) {
  var templatePath = path.resolve('modules/authentication/templates/user-account-locked-email.server.view.html');
  var replacements = {
    name: user.displayName,
    appName: config.app.title
  };

  return mail.sendMail({
    to: user.email,
    subject: 'Your account has been locked',
    templatePath: templatePath,
    replacements: replacements
  })
    .catch(function(err) {
      console.log('email send error-', err);
    });
};
