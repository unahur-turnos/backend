'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Usuarios', [
      {
        nombre: 'Juana',
        apellido: 'Azurduy',
        fechaNacimiento: '1780-07-12',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'José',
        apellido: 'Artigas',
        fechaNacimiento: '1764-06-19',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Simón',
        apellido: 'Bolívar',
        fechaNacimiento: '1783-04-24',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Usuarios', null, {});
  },
};
