'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('propiedades', {
      propiedad_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      arrendador_uid: {  // 👈 Nombre actualizado
        type: Sequelize.STRING(28),  // Longitud exacta
        allowNull: false,
        references: {
          model: 'arrendadores',
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
        allowNull: false,
        validate: {
          min: 0
        }
      },
      estado: {
        type: Sequelize.ENUM('disponible', 'ocupada', 'mantenimiento'),
        allowNull: false,
        defaultValue: 'disponible'
      }
    });

    // Índices para búsquedas comunes
    await queryInterface.addIndex('propiedades', ['arrendador_uid']);
    await queryInterface.addIndex('propiedades', ['estado']);
    await queryInterface.addIndex('propiedades', ['precio']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('propiedades');
  }
};