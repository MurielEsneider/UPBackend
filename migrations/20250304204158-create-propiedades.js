'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('propiedad', {
      propiedad_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      arrendador_id: {  // Cambiado de usuario_id a arrendador_id
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'arrendadores',  // Referencia a la tabla de arrendadores
          key: 'uid'
        },
        onDelete: 'CASCADE'
      },
      direccion: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('disponible', 'ocupada', 'mantenimiento'),
        allowNull: false,
        defaultValue: 'disponible'
      }
    });

    await queryInterface.addIndex('propiedad', ['arrendador_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('propiedad');
  }
};