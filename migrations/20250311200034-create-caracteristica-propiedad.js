'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('caracteristicas_propiedades', {
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
          model: 'propiedades',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      tipo_vivienda: {
        type: Sequelize.ENUM(
          'Apartamento', 
          'Casa', 
          'Casa de Familia', 
          'Estudio', 
          'Habitación'
        ),
        allowNull: true
      },
      wifi: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      energia: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      tv: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      cocina: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      agua: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      garaje: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      lavadora: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      nevera: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      gas: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      habitaciones: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      banos: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      capacidad: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      estacionamientos: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      jardin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      piscina: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      vista_montaña: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      terraza: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      amoblado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      acepta_mascotas: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
      },
    });

    // Índices optimizados
    await queryInterface.addIndex('caracteristicas_propiedades', ['propiedad_id'], {
      name: 'idx_caract_propiedad_id'
    });
    
    await queryInterface.addIndex('caracteristicas_propiedades', ['tipo_vivienda'], {
      name: 'idx_caract_tipo_vivienda'
    });
  },

  async down(queryInterface, Sequelize) {
    // Eliminar índices primero
    await queryInterface.removeIndex('caracteristicas_propiedades', 'idx_caract_propiedad_id');
    await queryInterface.removeIndex('caracteristicas_propiedades', 'idx_caract_tipo_vivienda');
    
    // Eliminar tabla
    await queryInterface.dropTable('caracteristicas_propiedades');
    
    // Eliminar tipo ENUM
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_caracteristicas_propiedades_tipo_vivienda";'
    );
  }
};