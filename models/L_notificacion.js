'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notificacion extends Model {
    static associate(models) {
      // Una notificación pertenece a un usuario
      Notificacion.belongsTo(models.Usuario, { 
        foreignKey: 'usuario_id', 
        as: 'usuario'
      });

      // Una notificación pertenece a un propietario
      Notificacion.belongsTo(models.Arrendador, { 
        foreignKey: 'arrendador_uid', 
        as: 'arrendador'
      });
    }
  }

  Notificacion.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Permitir nulo si es para un propietario
      references: {
        model: 'usuarios',
        key: 'usuario_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    // Actualizamos esta columna para que sea STRING y refiera a 'uid'
    arrendador_uid: {
      type: DataTypes.STRING,
      allowNull: true, // Permitir nulo si es para un usuario
      references: {
        model: 'arrendadores',
        key: 'uid'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    leida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notificacion',
    freezeTableName: true,  // Evita que Sequelize pluralice automáticamente
    tableName: 'Notificacion'
  });

  return Notificacion;
};
