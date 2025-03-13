'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('caracteristicas_propiedades', {
      caracteristica_id: {  // 👈 Nombre coherente
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      propiedad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'propiedades',
          key: 'id'   // Referenciamos la columna "id" de la tabla "propiedades"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipo_caracteristica: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      valor: {
        type: Sequelize.STRING(100),
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Índices para consultas comunes
    await queryInterface.addIndex('caracteristicas_propiedades', ['propiedad_id']);
    await queryInterface.addIndex('caracteristicas_propiedades', ['tipo_caracteristica']);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('caracteristicas_propiedades');
  }
};