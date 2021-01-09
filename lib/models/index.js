import fs from 'fs';
import { basename, extname, join } from 'path';
import Sequelize from 'sequelize';
import Configs from '../config/config';

const thisFile = basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = Configs[env];

function initSequelize() {
  return config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable])
    : new Sequelize(config.database, config.username, config.password, config);
}

const sequelize = initSequelize();

const isHiddenFile = (file) => file.startsWith('.');
const isJsFile = (file) => extname(file) === '.js';
const isTestFile = (file) => file.includes('.test.js');
const isThisFile = (file) => file === thisFile;

const db = {};

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      !isHiddenFile(file) &&
      !isThisFile(file) &&
      isJsFile(file) &&
      !isTestFile(file)
  )
  .forEach((file) => {
    const model = require(join(__dirname, file)).default;
    model.init(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
