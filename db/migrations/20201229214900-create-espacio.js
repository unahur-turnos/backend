'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Espacios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      edificioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Edificio',
          key: 'id',
        },
      },
      piso: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      habilitado: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      aforo: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Espacios');
  },
};
