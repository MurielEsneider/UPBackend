'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PublicacionesGuardadas extends Model {
    static associate(models) {
      // No es necesario definir relaciones aquí (se manejan en Usuario y Publicacion)
    }
  }

  PublicacionesGuardadas.init({
    publicacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'publicaciones',
        key: 'publicacion_id'
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'usuario_id'
      }
    }
  }, {
    sequelize,
    modelName: 'PublicacionesGuardadas',
    tableName: 'publicaciones_guardadas', // Nombre de la tabla en snake_case
    freezeTableName: true,
    timestamps: false // Opcional: si no necesitas createdAt/updatedAt
  });

  return PublicacionesGuardadas;
};