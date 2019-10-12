'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
  express = require('./express'),
  expressS = require('express'),
  path = require('path'),
  chalk = require('chalk');

module.exports.init = function init(callback) {
  var db = require('./config/lib/sequelize');
  var app = express.init(db);
  if (callback) callback(app, db, config);
};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, db, config) {

    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {
      // Create server URL
      var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization

      console.log('---------------------');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
      console.log(chalk.green('Server:          ' + server));
      console.log(chalk.green('Database:'));
      console.log(chalk.green('  Host:          ' + config.db.host));
      console.log(chalk.green('  Name:          ' + config.db.database));
      console.log(chalk.green('  Username:      ' + config.db.username));
      console.log(chalk.green('App version:     ' + config.meanjs.version));

      console.log('---------------------');

      if (callback) callback(app, db, config);
    });
  });
};
