const path = require('path');
const configFile = process.env.NODE_ENV === 'test' ? 'database-test.json' : 'database.json';
const dbConfig = require(path.resolve('./config/credentials/' + configFile));
const authHelper = require(path.resolve('./modules//authentication/helpers/auth.server.helper'));

dbConfig.password = authHelper.base64Decode(dbConfig.password);

module.exports = dbConfig;
