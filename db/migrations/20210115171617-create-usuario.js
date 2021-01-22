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
        allowNull: false,
        type: Sequelize.STRING,
      },
      contrasenia: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      dni: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true,
      },
      telefono: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      rol: {
        allowNull: false,
        type: Sequelize.ENUM(
          'invitado',
          'estudiante',
          'docente',
          'bedel',
          'admin'
        ),
        default: 'invitado',
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
