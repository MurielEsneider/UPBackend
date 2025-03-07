'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Publicacion extends Model {
    static associate(models) {
      // Relación con Propiedad (CORREGIDO)
      Publicacion.belongsTo(models.Propiedad, {
        foreignKey: 'propiedad_id',
        as: 'propiedad',
        onDelete: 'CASCADE'
      });

      // Relación N:M con Usuario (AJUSTAR NOMBRE TABLA PIVOTE)
      Publicacion.belongsToMany(models.Usuario, {
        through: 'publicaciones_guardadas',  // Nombre de tabla en snake_case
        foreignKey: 'publicacion_id',
        as: 'usuariosGuardaron'
      });
    }
  }

  Publicacion.init({
    publicacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propiedades',  // CORRECTO: Nombre de tabla en plural
        key: 'propiedad_id'
      },
      onDelete: 'CASCADE'
    },
    // ... (otros campos se mantienen igual)
  }, {
    sequelize,
    modelName: 'Publicacion',
    freezeTableName: true,
    tableName: 'Publicaciones',  // CORREGIDO: Nombre en plural y snake_case
    timestamps: false
  });

  return Publicacion;
};