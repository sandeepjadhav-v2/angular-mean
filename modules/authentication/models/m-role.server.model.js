'use strict';

module.exports = function (sequelize, DataTypes) {

  var Role = sequelize.define('Role', {
    name: { type: DataTypes.STRING },
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'roles',
    instanceMethods: {
      toJSON: function () {
        var values = this.get();
        return values;
      }
    },
    associate: function (models) {
      Role.hasMany(models.User);
    }
  });

  Role.SUPERUSER = 'superuser';
  Role.ADMIN = 'admin';
  Role.USER = 'user';
  Role.MANAGER = 'manager';

  return Role;
};
