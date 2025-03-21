const { Propiedad, PropiedadImagen, CaracteristicaPropiedad } = require('../models');

const getPublicacion = async (req, res) => {
  try {
    const { id } = req.params; // ID de la propiedad a mostrar

    const propiedad = await Propiedad.findByPk(id, {
      include: [
        {
          model: PropiedadImagen,
          as: 'imagenes'  // Debe coincidir con el alias definido en la asociación
        },
        {
          model: CaracteristicaPropiedad,
          as: 'caracteristicas' // Asegúrate de que este alias coincide con tu modelo de características
        }
      ]
    });

    if (!propiedad) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    return res.status(200).json(propiedad);
  } catch (error) {
    console.error("Error al obtener la publicación:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getPublicacion,
  // ... otros métodos
};
