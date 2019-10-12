'use strict';

var _ = require('lodash'),
  path = require('path'),
  Sequelize = require('sequelize'),
  config = require(path.resolve('./config/config.js')),
  authHelper = require(path.resolve('./modules//authentication/helpers/auth.server.helper'));

require(path.resolve('./config/lib/sequelize-isunique-validator'))(Sequelize);

// The db password is  Base64 encoded. So decode it back to plain text.
config.db.password = authHelper.base64Decode(config.db.password);

var db = {};

var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db);

sequelize
  .authenticate()
  .then(function () {
    console.log('Database connection has been established successfully.');
  }).catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

// loop through all files in models directory ignoring hidden files and this file

// Load the sequelize models
config.files.server.models.filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'session.server.model.js');
}).forEach(function (modelPath) {
  if (_.includes(modelPath, 'm-')) {
    var model = sequelize.import(path.resolve(modelPath));
    db[model.name] = model;
  }
});

// invoke associations on each of the models
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db);
  }
});


// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);
