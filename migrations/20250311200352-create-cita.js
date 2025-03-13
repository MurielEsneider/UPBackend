

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('citas', {
      cita_id: {  // 👈 Nombre consistente
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'usuario_id'
        },
        onDelete: 'CASCADE'
      },
      propiedad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'propiedades',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      fecha: {
        type: Sequelize.DATEONLY,  // 👈 Tipo corregido
        allowNull: false
      },
      hora: {
        type: Sequelize.TIME,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'confirmada', 'cancelada'),
        defaultValue: 'pendiente'
      },
      reglas_departamento: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      oferta: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      contra_oferta: {
        type: Sequelize.DECIMAL(10, 2),
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Índices para consultas comunes
    await queryInterface.addIndex('citas', ['usuario_id']);
    await queryInterface.addIndex('citas', ['propiedad_id']);
    await queryInterface.addIndex('citas', ['fecha']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('citas');
  }
};