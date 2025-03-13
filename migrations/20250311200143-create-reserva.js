
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservas', {
      reserva_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {  // 👈 Referencia añadida
          model: 'usuarios',
          key: 'usuario_id'
        },
        onDelete: 'CASCADE'
      },
      propiedad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {  // 👈 Referencia añadida
          model: 'propiedades',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      fecha_inicio: {
        type: Sequelize.DATEONLY,  // 👈 Tipo corregido
        allowNull: false
      },
      fecha_fin: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'confirmada', 'cancelada'),
        defaultValue: 'pendiente'
      },
      monto_reserva: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      anticipo: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Índices para consultas frecuentes
    await queryInterface.addIndex('reservas', ['usuario_id']);
    await queryInterface.addIndex('reservas', ['propiedad_id']);
    await queryInterface.addIndex('reservas', ['estado']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reservas');
  }
};