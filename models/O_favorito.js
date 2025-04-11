'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Favorito extends Model {
    static associate(models) {
      // Definir asociaciones en los modelos padre
    }
  }
  
  Favorito.init({
    usuario_uid: {
      type: DataTypes.STRING(28),
      primaryKey: true
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'Favorito',
    tableName: 'Favoritos'
  });
  
  return Favorito;
};