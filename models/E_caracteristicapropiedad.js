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
    caracteristica_id: {  // 👈 Nombre más descriptivo
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    propiedad_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    tipo_caracteristica: { 
      type: DataTypes.STRING(50),  // Longitud limitada
      allowNull: false 
    },
    valor: { 
      type: DataTypes.STRING(100),  // Longitud limitada
      allowNull: false 
    }
  }, {
    sequelize,
    modelName: "CaracteristicaPropiedad",
    tableName: 'caracteristicas_propiedades',  // 👈 Nombre más consistente
    freezeTableName: true,
    timestamps: true
  });

  return CaracteristicaPropiedad;
};
