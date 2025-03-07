'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('caracteristicapropiedades', { // Nombre de tabla en minúsculas y snake_case
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      propiedad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'propiedades', // Nombre correcto de la tabla (en minúsculas)
          key: 'propiedad_id'   // Clave correcta de referencia
        },
        onDelete: 'CASCADE'
      },
      tipo_caracteristica: {
        type: Sequelize.STRING,
        allowNull: false
      },
      valor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('caracteristicapropiedades'); // Nombre consistente en minúsculas
  }
};