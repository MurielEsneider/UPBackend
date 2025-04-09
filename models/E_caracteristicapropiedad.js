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
    capacidad: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "La capacidad no puede ser negativa"
        }
      }
    },
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
    estacionamientos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 }
    },
    jardin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    piscina: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    vista_montana: { // ¡Nombre actualizado sin ñ!
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    terraza: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
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