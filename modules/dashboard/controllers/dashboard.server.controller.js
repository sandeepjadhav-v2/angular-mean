'use strict';

const path = require('path'),
  db = require(path.resolve('./config/lib/sequelize'));

exports.list = async (req, res) => {
  let data = {
    name: 'sandeep',
    lname: 'Jadhav'
  };

  res.send(data);
};