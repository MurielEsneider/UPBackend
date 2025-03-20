'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('caracteristicas_propiedades', {
      caracteristica_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      propiedad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'propiedades', // Nombre de la tabla referenciada
          key: 'id'             // Columna de la tabla referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipo_vivienda: {
        type: Sequelize.ENUM('Apartamento', 'Casa', 'Casa de Familia', 'Estudio', 'Habitación'),
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
      baños: {
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('caracteristicas_propiedades');
    // Eliminar el tipo ENUM si existe para evitar conflictos en futuras migraciones
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_caracteristicas_propiedades_tipo_vivienda";');
  }
};
