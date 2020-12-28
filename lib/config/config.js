const debug = require('debug');

const config = {
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  host: process.env.SQL_HOST || 'localhost',
  port: process.env.SQL_PORT || '5432',
  dialect: 'postgresql',
  logging: debug('sequelize'),
};

module.exports = {
  development: {
    ...config,
    seederStorage: 'sequelize',
  },
  test: {
    ...config,
    database: process.env.SQL_TEST_DATABASE || process.env.SQL_DATABASE,
  },
  production: config,
};
