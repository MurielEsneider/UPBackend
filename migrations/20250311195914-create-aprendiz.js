'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('aprendices', {  // Nombre de tabla en plural
      aprendiz_id: {  // PK propia
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      usuario_uid: {
        type: Sequelize.STRING(28), // Cambiado a STRING(28) para que coincida con usuarios.uid
        allowNull: false,
        unique: true,  // Relación 1:1
        references: {
          model: 'usuarios',  // Nombre de tabla referenciada
          key: 'uid'
        },
        onDelete: 'CASCADE'
      },
      programa_formacion: {
        type: Sequelize.STRING,
        allowNull: false  // Coincide con el modelo
      },
      ficha: {
        type: Sequelize.INTEGER,
        allowNull: false  // Coincide con el modelo
      },
      identificacion_sena: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true  // Restricción única
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Índice para identificación única
    await queryInterface.addIndex('aprendices', ['identificacion_sena'], {
      unique: true,
      name: 'idx_identificacion_sena'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('aprendices');  // Nombre correcto
  }
};
