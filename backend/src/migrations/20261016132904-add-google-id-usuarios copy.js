'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('usuarios', 'google_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    })

    await queryInterface.addColumn('usuarios', 'perfil', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await queryInterface.changeColumn('usuarios', 'senha', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('usuarios', 'google_id', 'perfil');
  }
};
