const { CaracteristicaPropiedad, Propiedad } = require('../models');
const sequelize = require('../models').sequelize;

const createCaracteristica = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { propiedad_id, ...caracteristicas } = req.body;
    // Validar existencia de la propiedad
    const propiedad = await Propiedad.findByPk(propiedad_id, { transaction });
    if (!propiedad) {
      await transaction.rollback();
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    // Crear características usando defaults del modelo y el campo capacidad ya incluido
    const newCaracteristica = await CaracteristicaPropiedad.create(
      { propiedad_id, ...caracteristicas },
      { transaction }
    );

    await transaction.commit();
    return res.status(201).json(newCaracteristica);

  } catch (error) {
    await transaction.rollback();
    
    const responseError = {
      error: "Error al crear características",
      details: process.env.NODE_ENV === 'development' ? error.message : null
    };

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        ...responseError,
        type: "VALIDATION_ERROR",
        fields: error.errors.map(e => e.path)
      });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        ...responseError,
        type: "RELATIONSHIP_ERROR"
      });
    }

    return res.status(500).json(responseError);
  }
};


module.exports = {
  createCaracteristica
};