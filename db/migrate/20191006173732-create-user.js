'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        last_name: Sequelize.STRING,
        display_name: Sequelize.STRING,
        first_name: Sequelize.STRING,
        email: {
          type: Sequelize.STRING(128),
          allowNull: false
        },
        username: {
          type: Sequelize.STRING(64),
          allowNull: false
        },
        language: {
          type: Sequelize.STRING,
          defaultValue: 'en-US'
        },
        password: Sequelize.STRING,
        salt: Sequelize.STRING,
        profile_image_url: Sequelize.STRING,
        provider: {
          type: Sequelize.STRING,
          allowNull: false
        },
        provider_data: {
          type: Sequelize.TEXT
        },
        email_verified: {
          type: Sequelize.BOOLEAN
        },
        role_id: {
          type: Sequelize.INTEGER
        },
        created_by_user_id: {
          type: Sequelize.INTEGER
        },
        provider_id: {
          type: Sequelize.INTEGER
        },
        email_verify_token: {
          type: DataTypes.STRING
        },
        email_verify_token_expires: {
          type: DataTypes.DATE
        },
        phone_number: {
          type: DataTypes.STRING
        },
        last_password_updated_at: {
          type: DataTypes.DATE
        },
        failed_login_attempts: {
          type: DataTypes.INTEGER
        },
        locked_status: {
          type: DataTypes.INTEGER
        },
        deleted_at: {
          type: DataTypes.DATE
        },
        updated_by_user_id: {
          type: DataTypes.INTEGER
        },
        reset_password_token: Sequelize.STRING,
        reset_password_expires: Sequelize.DATE,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE
      }
    )
      .then(function () {
        return queryInterface.addIndex('users', ['email'], {
          indexName: 'idx_unique_user_email',
          indicesType: 'UNIQUE'
        });
      })
      .then(function () {
        return queryInterface.addIndex('users', ['username'], {
          indexName: 'idx_unique_username_email',
          indicesType: 'UNIQUE'
        });
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
