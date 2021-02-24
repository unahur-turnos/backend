module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Autorizaciones', 'estuvoEnContacto');
    await queryInterface.addColumn('Autorizaciones', 'medioDeTransporte', {
      type: Sequelize.STRING,
      default: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Autorizaciones', 'medioDeTransporte');
  },
};
