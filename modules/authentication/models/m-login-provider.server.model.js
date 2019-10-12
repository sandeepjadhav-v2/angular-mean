'use strict';

/**
 * User Model
 */
module.exports = function (sequelize, DataTypes) {

  var LoginProvider = sequelize.define('LoginProvider',
    {
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'provider'
      },
      providerId: {
        type: DataTypes.STRING,
        field: 'provider_id'
      },
      providerData: {
        type: DataTypes.TEXT,
        field: 'provider_data'
      },
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id'
      }
    },
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      // define the table's name
      tableName: 'login_providers',
      associate: function (models) {
        LoginProvider.belongsTo(models.User);
      }
    }
  );
  return LoginProvider;
};
