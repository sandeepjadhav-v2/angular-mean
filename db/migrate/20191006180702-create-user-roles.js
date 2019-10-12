'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('roles',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE
      })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('roles');
  }
};
