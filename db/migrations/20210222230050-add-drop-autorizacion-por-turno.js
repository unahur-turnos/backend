'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Turnos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usuarioId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'id',
        },
      },
      actividadId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Actividades',
          key: 'id',
        },
      },
      estuvoEnContacto: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      fechaHoraIngreso: {
        type: Sequelize.DATE,
        default: null,
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
    await queryInterface.dropTable('Autorizaciones');
  },
};
