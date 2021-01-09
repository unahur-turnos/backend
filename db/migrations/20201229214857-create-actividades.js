'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Actividads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      espacioId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Espacios',
          key: 'id',
        },
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      fechaHoraInicio: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      fechaHoraFin: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      responsable: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      dniResponsable: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      tipoResponsable: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      estado: {
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      requiereControl: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    },
    {
      esquema: "public",
      tableName: "Actividads"
    },
    {freezeTableName: true})
    },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Actividads');
  },
};

