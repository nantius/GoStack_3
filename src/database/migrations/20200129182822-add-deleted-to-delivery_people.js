module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('delivery_people', 'deleted_at', {
      type: Sequelize.DATE
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('delivery_people', 'deleted_at');
  }
};
