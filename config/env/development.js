'use strict';

var path = require('path'),
  defaultEnvConfig = require(path.resolve('./config/env/default.js')),
  mysqlDatabaseConfig = require(path.resolve('.//config/credentials/database.json'));

module.exports = {
  db: mysqlDatabaseConfig,
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      host: process.env.MAILER_HOST || 'MAILER_HOST',
      port: process.env.MAILER_PORT || 'MAILER_PORT',
      secure: process.env.MAILER_SECURE || 'MAILER_SECURE',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'PASSWORD'
      }
    }
  },
  livereload: true,
  runTasks: process.env.RUN_TASKS,
  runTestTasks: process.env.RUN_TEST_TASKS,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'seeduser',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'seedadmin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};
