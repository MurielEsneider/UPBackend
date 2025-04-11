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
/**
 * Controller para buscar alojamientos basándose en las características especificadas en los query params.
 * Se espera recibir en la query los filtros correspondientes a los campos definidos en la tabla CaracteristicaPropiedad.
 * Por ejemplo: /api/alojamientos?capacidad=4&tienePiscina=true
 */
const buscarAlojamientoPorCaracteristicas = async (req, res) => {
  try {
    const filters = req.query;
    const whereCaracteristica = {};

    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        let value = filters[key];

        // convertir "true"/"false" a booleanos reales
        if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        } else if (!isNaN(value)) {
          // convertir a número si aplica
          value = Number(value);
        }

        whereCaracteristica[key] = value;
      }
    }

    const alojamientos = await Propiedad.findAll({
      include: [
        {
          model: CaracteristicaPropiedad,
          as: 'caracteristicas',
          where: whereCaracteristica
        }
      ]
    });

    if (alojamientos.length === 0) {
      return res.status(404).json({ error: "No se encontraron alojamientos con las características especificadas" });
    }

    return res.status(200).json(alojamientos);

  } catch (error) {
    return res.status(500).json({
      error: "Error al buscar alojamientos",
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = {
  createCaracteristica,
  buscarAlojamientoPorCaracteristicas
};