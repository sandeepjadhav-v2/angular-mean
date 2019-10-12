'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [
      { name: 'superuser' },
      { name: 'admin' },
      { name: 'user' }
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
