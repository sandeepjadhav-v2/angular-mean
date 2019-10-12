'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    var superUser = {
      first_name: 'Super',
      last_name: 'User',
      display_name: 'Super User',
      username: 'superuser',
      email: 'superuser@gamil.com',
      provider: 'local',
      password: '0rurgwmibyYMeZRSFLmVAis6Yk/lvufdcU5O7dxvS0zSA6f2zI23DtiTjU5bpjun6GQ00ZD/QQeX4hF4BXfaWw==',
      salt: 'tY2vLlyUuQdeAJNGBpeZZg==',
      email_verified: true
    };
    const query = `select id as roleId FROM roles where name = 'superuser'`;
    let roles = await queryInterface.sequelize.query(query, { raw: true, type: queryInterface.sequelize.QueryTypes.SELECT });
    superUser.role_id = roles[0].roleId;
    return queryInterface.bulkInsert('users', [superUser]);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, { where: { username: 'superuser' } });
  }
};
