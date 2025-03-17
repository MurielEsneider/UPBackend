'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Arrendador extends Model {
    static associate(models) {
      // Relación con Propiedades (1:N)
      Arrendador.hasMany(models.Propiedad, {
        foreignKey: 'arrendador_uid',  // 👈 Nombre consistente con PK
        as: 'propiedades',
        onDelete: 'CASCADE'
      });

      // Relación con Notificaciones (1:N)
      Arrendador.hasMany(models.Notificacion, {
        foreignKey: 'arrendador_uid',  // 👈 Mismo formato
        as: 'notificaciones',
        onDelete: 'CASCADE'
      });
    }
  }

  Arrendador.init({
    uid: {
      type: DataTypes.STRING(28), // 👈 Longitud fija de 28 caracteres
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true  // Validación añadida
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    fotoPerfil: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true  // Valida que sea una URL válida
      }
    },
    historial_sistema_arriendo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    documento: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [5, 255]  // Longitud mínima/máxima
      }
    }
  }, {
    sequelize,
    modelName: 'Arrendador',
    tableName: 'arrendadores',
    freezeTableName: true,
    timestamps: true
  });

  return Arrendador;
};

