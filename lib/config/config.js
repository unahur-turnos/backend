const debug = require('debug');
const parse = require('pg-connection-string').parse;

function parseHerokuUrlIfPresent() {
  const url = process.env.DATABASE_URL;

  if (url === undefined) {
    return {};
  }

  const config = parse(url);

  // Heroku necesita sí o sí SSL, y para eso hay que habilitar el driver nativo.
  return {
    ...config,
    username: config.user,
    native: true,
  };
}

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
  production: {
    ...config,
    ...parseHerokuUrlIfPresent(),
  },
};
