'use strict';

const { isNil } = require('ramda');

async function getIdDeEdificioLlamado({ sequelize }, nombre) {
  const entity = await sequelize.query(
    `SELECT id FROM "Edificios" WHERE nombre = '${nombre}'`,
    { plain: true }
  );

  if (isNil(entity)) {
    throw new Error(
      `No se encontró ningún edificio llamado ${nombre}. Verificá que exista en la base de datos y volvé a ejecutar este seeder.`
    );
  }

  return entity.id;
}

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('Espacios', [
      {
        edificioId: await getIdDeEdificioLlamado(
          queryInterface,
          'Malvinas Argentinas'
        ),
        piso: 1,
        nombre: 'Laboratorio 14',
        habilitado: false,
        aforo: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        edificioId: await getIdDeEdificioLlamado(queryInterface, 'Origone B'),
        piso: 0,
        nombre: 'Aula 8',
        habilitado: true,
        aforo: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        edificioId: await getIdDeEdificioLlamado(queryInterface, 'Origone A'),
        piso: 0,
        nombre: 'Biblioteca',
        habilitado: true,
        aforo: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('Espacios', null, {});
  },
};
