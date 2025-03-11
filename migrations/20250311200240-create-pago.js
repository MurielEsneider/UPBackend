'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pagos', {
      pago_id: {  // 👈 Nombre consistente
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reserva_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'reservas',
          key: 'reserva_id'
        },
        onDelete: 'CASCADE'
      },
      monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      fecha_pago: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      metodo_pago: {
        type: Sequelize.ENUM('tarjeta_credito', 'transferencia_bancaria', 'efectivo'),
        allowNull: false
      },
      estado_pago: {
        type: Sequelize.ENUM('pendiente', 'completado', 'rechazado'),
        allowNull: false,
        defaultValue: 'pendiente'
      },
      referencia_transaccion: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      comprobante_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')  // 👈 Actualización automática
      }
    });

    // Índices para consultas comunes
    await queryInterface.addIndex('pagos', ['reserva_id']);
    await queryInterface.addIndex('pagos', ['estado_pago']);
    await queryInterface.addIndex('pagos', ['metodo_pago']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pagos');
  }
};