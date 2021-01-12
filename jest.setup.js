import db from './lib/models';

afterAll(() => db.sequelize.close());
