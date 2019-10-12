'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')),
  _ = require('lodash'),
  accountLocked = require(path.resolve('./modules/authentication/helpers/account-locked-email.server.helper'));

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy(
    {
      usernameField: 'usernameOrEmail',
      passwordField: 'password'
    },
    async function (usernameOrEmail, password, done) {
      return db.User.findOne({
        where: {
          username: usernameOrEmail
        },
        include: [{ model: db.Role, as: 'role' }, { model: db.LoginProvider, as: 'providers' }]
      })
        .then(async function (user) {
          console.log('displayName: ', user.displayName);
          if (!user) {
            console.log('No User found.......................');
            return done(null, false, {
              message: 'Invalid username or password'
            });
          } else {
            if (user.lockedStatus) {
              return done(null, false, {
                message: 'Your account has been locked because of many failed attempts.Please reset your password by clicking on Forgot password link.'
              });
            } else if (!user.emailVerified) {
              return done(null, false, {
                message: 'Your account has not verified. Please click on link sent via previous email to activate the account.',
                userDetails: user.toJSON()
              });
            } else if (!user.password) {
              // else if (!user.authenticate(password)) {
              await user.increment('failedLoginAttempts', { by: 1 });
              if (user.failedLoginAttempts >= 2 && !user.lockedStatus) {
                await db.User.update({ lockedStatus: true }, { where: { id: user.id } });
                accountLocked.sendEmail(user);
                return done(null, false, {
                  message: 'Your account has been locked because of many failed attempts.Please reset your password by clicking on Forgot password link.'
                });
              }
              console.log('User logged successfully.....................');
              return done(null, false, {
                message: 'Invalid username or password'
              });
            } else {
              console.log('User logged successfully.....................');
              return db.User.update({ failedLoginAttempts: 0 }, { where: { id: user.id } })
                .then(function() {
                  console.log(user.toJSON())
                  return done(null, user.toJSON());
                });
            }
          }
        })
        .catch(function (err) {
          return done(err);
        });
    }));
};
