'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.createTable('login_providers',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        provider: {
          type: Sequelize.STRING(128),
          allowNull: false
        },
        provider_id: {
          type: Sequelize.STRING(128),
          allowNull: false
        },
        provider_data: {
          type: Sequelize.TEXT
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'cascade'
        },
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE
      }
    )
      .then(function () {
        return queryInterface.addIndex('login_providers', ['provider_id'], {
          indexName: 'idx_unique_login_providers_provider_id',
          indicesType: 'UNIQUE'
        });
      })
      .then(function () {
        return queryInterface.addIndex('login_providers', ['provider'], {
          indexName: 'idx_unique_login_providers_provider',
          indicesType: 'UNIQUE'
        });
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('login_providers');
  }
};

