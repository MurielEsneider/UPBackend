'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PublicacionGuardada extends Model {
    static associate(models) {
      // Relación con Usuario (debe coincidir con el modelo Usuario)
      PublicacionGuardada.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
        onDelete: 'CASCADE' // Recomendado para integridad referencial
      });
      
      // Relación con Arrendador (nombre correcto del modelo)
      PublicacionGuardada.belongsTo(models.Arrendador, { // Cambiar Propietario por Arrendador
        foreignKey: 'arrendador_id', // Coincide con el campo en la migración
        as: 'arrendador',
        onDelete: 'CASCADE'
      });

      // Falta relación con Publicacion (necesaria en tabla pivote)
      PublicacionGuardada.belongsTo(models.Publicacion, {
        foreignKey: 'publicacion_id',
        as: 'publicacion',
        onDelete: 'CASCADE'
      });
    }
  }

  PublicacionGuardada.init({
    publicacion_id: { // Campo faltante (clave foránea esencial)
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'publicaciones',
        key: 'publicacion_id'
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'usuario_id'
      }
    },
    arrendador_id: { // Nombre corregido (de propietario_id a arrendador_id)
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'arrendadores',
        key: 'uid'
      }
    }
  }, {
    sequelize,
    modelName: 'PublicacionGuardada',
    freezeTableName: true,
    tableName: 'publicacionesGuardadas', // Coincide con nombre en migración
    timestamps: true, // Debe coincidir con los campos en la migración
    underscored: true // Para usar snake_case automáticamente
  });

  return PublicacionGuardada;
};