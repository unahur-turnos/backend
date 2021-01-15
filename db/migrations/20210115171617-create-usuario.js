'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      apellido: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contrasenia: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dni: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
      },
      telofono: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      rol: {
        type: Sequelize.STRING,
        default: 'Invitado',
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
    await queryInterface.dropTable('Usuarios');
  },
};
