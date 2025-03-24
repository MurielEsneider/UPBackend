'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CaracteristicaPropiedad extends Model {
    static associate(models) {
      this.belongsTo(models.Propiedad, {
        foreignKey: "propiedad_id",
        as: 'propiedad',
        onDelete: "CASCADE"
      });
    }
  }

  CaracteristicaPropiedad.init({
    id: {  // Cambiado de caracteristica_id a id
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'  // Mapeo a columna existente
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propiedades',
        key: 'id'
      }
    },
    tipo_vivienda: {
      type: DataTypes.ENUM('Apartamento', 'Casa', 'Casa de Familia', 'Estudio', 'Habitación'),
      allowNull: true,
      validate: {
        isIn: {
          args: [['Apartamento', 'Casa', 'Casa de Familia', 'Estudio', 'Habitación']],
          msg: "Tipo de vivienda no válido"
        }
      }
    },
    // ... (mantener los demás campos igual pero agregar validaciones)
    habitaciones: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: {
          args: [0],
          msg: "El número de habitaciones no puede ser negativo"
        }
      }
    },
    banos: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: {
          args: [0],
          msg: "El número de baños no puede ser negativo"
        }
      }
    },
    // ... (agregar validaciones similares para otros campos numéricos)
  }, {
    sequelize,
    modelName: "CaracteristicaPropiedad",
    tableName: 'caracteristicas_propiedades',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,  // Habilitar borrado lógico
    indexes: [
      {
        fields: ['propiedad_id'],
        name: 'idx_propiedad_id'
      },
      {
        fields: ['tipo_vivienda'],
        name: 'idx_tipo_vivienda'
      }
    ],
    hooks: {
      beforeValidate: (caracteristica) => {
        // Normalización de datos
        if (caracteristica.tipo_vivienda) {
          caracteristica.tipo_vivienda = caracteristica.tipo_vivienda.trim();
        }
      }
    }
  });

  return CaracteristicaPropiedad;
};