'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasOne(models.Aprendiz, { foreignKey: "usuario_id", onDelete: "CASCADE" });
      Usuario.hasOne(models.Arrendador, { foreignKey: "usuario_id", onDelete: "CASCADE" });
      Usuario.hasMany(models.Propiedad, { foreignKey: "usuario_id", onDelete: "CASCADE" });
      Usuario.hasMany(models.Reserva, { foreignKey: "usuario_id", onDelete: "CASCADE" });
      Usuario.hasMany(models.Cita, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    }
  }

  Usuario.init({
    usuario_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombres_apellidos: { type: DataTypes.STRING, allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATE },
    numero_telefono: { type: DataTypes.STRING(15), allowNull: false },
    correo_electronico: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    rol: { type: DataTypes.ENUM("administrador", "arrendador", "aprendiz"), allowNull: false },
  }, {
    sequelize,
    modelName: "Usuarios",
    timestamps: false, // Si no necesitas createdAt y updatedAt
  });

  return Usuario;
};
