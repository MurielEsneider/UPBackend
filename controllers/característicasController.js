// controllers/caracteristicasController.js
const { CaracteristicaPropiedad } = require('../models'); // Ajusta la ruta según tu estructura

// Controller para crear las características de una propiedad
const createCaracteristica = async (req, res) => {
  try {
    const {
      propiedad_id,
      tipo_vivienda,
      wifi,
      energia,
      tv,
      cocina,
      agua,
      garaje,
      lavadora,
      nevera,
      gas,
      habitaciones,
      baños,
      capacidad,
      estacionamientos,
      jardin,
      piscina,
      vista_montaña,
      terraza,
      amoblado,
      acepta_mascotas
    } = req.body;

    const newCaracteristica = await CaracteristicaPropiedad.create({
      propiedad_id,
      tipo_vivienda,
      wifi,
      energia,
      tv,
      cocina,
      agua,
      garaje,
      lavadora,
      nevera,
      gas,
      habitaciones,
      baños,
      capacidad,
      estacionamientos,
      jardin,
      piscina,
      vista_montaña,
      terraza,
      amoblado,
      acepta_mascotas
    });

    return res.status(201).json(newCaracteristica);
  } catch (error) {
    console.error("Error al crear características:", error);
    return res.status(500).json({ error: "Error al guardar las características de la propiedad" });
  }
};


module.exports = {
    createCaracteristica
  };
  