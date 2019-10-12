'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  path = require('path'),
  db2 = require(path.resolve('./config/lib/sequelize')),
  config = require(path.resolve('./config/config')),
  _ = require('lodash');

/**
 * Module init function
 */
module.exports = function (app, db) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    return db2.User.findOne({
      where: { id: id },
      include: [{ model: db2.Role, as: 'role' }, { model: db2.LoginProvider, as: 'providers' }]
    }).then(function (user) {
      if (!user) {
        done(null, false);
        return null;
      } else {
        done(null, user.toJSON());
        return user;
      }

    }).catch(function (err) {
      done(err, null);
    });
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    var strategyName = path.basename(strategy, path.extname(strategy));
    if (strategyName === 'local') {
      // Local strategy needs to be present always
      require(path.resolve(strategy))(config);
    } else if (!config[strategyName] || (config[strategyName] && config[strategyName].enabled)) {
      require(path.resolve(strategy))(config);
    }
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
