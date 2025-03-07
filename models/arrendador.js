'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Arrendador extends Model {
    static associate(models) {
      // Un arrendador puede tener muchas propiedades
      Arrendador.hasMany(models.Propiedad, { 
        foreignKey: 'arrendador_id', 
        as: 'propiedades'
      });

      // Un arrendador puede tener muchos reportes
      /* Arrendador.hasMany(models.Reporte, { 
        foreignKey: 'arrendador_id', 
        as: 'reportes'
      });
 */
      // Un arrendador puede tener muchas notificaciones
      Arrendador.hasMany(models.Notificacion, { 
        foreignKey: 'arrendador_id', 
        as: 'notificaciones'
      });
    }
  }

  Arrendador.init({
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,   // Usamos el UID de Firebase como clave primaria
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
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
      allowNull: true
    },
    historial_sistema_arriendo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    documento: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Arrendador',
    freezeTableName: true,  // Evita que Sequelize pluralice automáticamente
    tableName: 'Arrendadores'
  });

  return Arrendador;

};
