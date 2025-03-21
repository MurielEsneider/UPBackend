'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CaracteristicaPropiedad extends Model {
    static associate(models) {
      CaracteristicaPropiedad.belongsTo(models.Propiedad, {
        foreignKey: "propiedad_id",
        onDelete: "CASCADE"
      });
    }
  }

  CaracteristicaPropiedad.init({
    caracteristica_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // Tipo de vivienda (selección única)
    tipo_vivienda: {
      type: DataTypes.ENUM('Apartamento', 'Casa', 'Casa de Familia', 'Estudio', 'Habitación'),
      allowNull: true
    },
    // Servicios (selección múltiple)
    wifi: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    energia: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tv: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cocina: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    agua: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    garaje: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lavadora: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    nevera: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    gas: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // Características principales
    habitaciones: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    baños: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    capacidad: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    estacionamientos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // Características exteriores
    jardin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    piscina: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    vista_montaña: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    terraza: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // Otros filtros
    amoblado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    acepta_mascotas: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: "CaracteristicaPropiedad",
    tableName: 'caracteristicas_propiedades',
    freezeTableName: true,
    timestamps: true
  });

  return CaracteristicaPropiedad;
};