'use strict';

var path = require('path'),
  fs = require('fs'),
  _ = require('lodash'),
  crypto = require('crypto'),
  config = require(path.resolve('./config/config')),
  db = require(path.resolve('./config/lib/sequelize'));


var exports = module.exports = {

  buildSortExpressionFromUIGrid: function (sortOptions) {
    sortOptions = _.flattenDeep([sortOptions]);
    sortOptions = _.map(sortOptions, function (opt) {
      return JSON.parse(opt);
    });

    sortOptions = _.sortBy(sortOptions, function (sortOption) {
      return sortOption.priority;
    });

    var sequelizeSortOption = _.map(sortOptions, function (sortOpt) {
      var colName = Object.keys(sortOpt)[0];
      var order = sortOpt[colName].direction;
      var tmp;

      // If its join column then handle differently.
      if (colName.indexOf('.') > -1) {
        tmp = db.sequelize.literal('\`' + colName + '\`' + ' ' + order);
      } else {
        tmp = db.sequelize.literal(colName + ' ' + order);
      }
      return tmp;
    });
    return sequelizeSortOption;
  },

  removeDirectory: function(dirPath, shouldRemoveSelf) {

    return new Promise(function (resolve, reject) {
      try {
        rmDir(dirPath, shouldRemoveSelf);
        resolve();
      } catch (err) {
        reject(err);
      }
    });

    function rmDir(dirPath, removeSelf) {
      if (removeSelf === undefined) {
        removeSelf = true;
      }
      var files = [];
      try {
        files = fs.readdirSync(dirPath);
      } catch (e) {
        return;
      }
      if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var filePath = path.join(dirPath, files[i]);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          } else {
            rmDir(filePath);
          }
        }
      }

      if (removeSelf) {
        fs.rmdirSync(dirPath);
      }
    }
  },

  generateVerificationKey: function () {
    var text = '';
    var possible = 'ABCDEF0123456789';

    for (var i = 0; i < 16; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
};
