// controllers/resenaController.js
const { Resena, Usuario } = require('../models');

// Obtener todas las reseñas de una propiedad
const getResenasByPropiedad = async (req, res) => {
  const { propiedad_id } = req.params;

  try {
    const resenas = await Resena.findAll({
      where: { propiedad_id },
      include: [{
        model: Usuario,
        as: 'autor',
        attributes: ['nombre']
      }],
      order: [['fecha_reseña', 'DESC']]
    });

    return res.status(200).json(resenas);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    return res
      .status(500)
      .json({ message: 'Error al obtener reseñas', error: error.message });
  }
};

// Crear una nueva reseña
const createResena = async (req, res) => {
  const { usuario_uid, propiedad_id, comentario, puntuacion } = req.body;

  try {
    if (!usuario_uid) {
      return res.status(400).json({ message: 'Usuario UID es requerido' });
    }
    if (!propiedad_id) {
      return res.status(400).json({ message: 'Propiedad ID es requerido' });
    }

    const nueva = await Resena.create({
      usuario_uid,
      propiedad_id,
      comentario,
      puntuacion
    });

    const resenaCompleta = await Resena.findByPk(nueva.resena_id, {
      include: [{
        model: Usuario,
        as: 'autor',
        attributes: ['nombre']
      }]
    });

    return res.status(201).json(resenaCompleta || nueva);
  } catch (error) {
    console.error('Error al crear reseña:', error);
    return res.status(500).json({
      message: 'Error al crear la reseña',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
};

// Obtener el promedio de puntuación para una propiedad
const getPromedioResenas = async (req, res) => {
  const { propiedad_id } = req.params;

  try {
    const [resultado] = await Resena.findAll({
      where: { propiedad_id },
      attributes: [
        [Resena.sequelize.fn('AVG', Resena.sequelize.col('puntuacion')), 'promedio']
      ]
    });

    const prom = parseFloat(resultado.get('promedio') || 0);
    return res.status(200).json({ promedio: prom });
  } catch (error) {
    console.error('Error al calcular promedio:', error);
    return res.status(500).json({
      message: 'Error al obtener el promedio de reseñas',
      error: error.message
    });
  }
};

// Eliminar una reseña por ID
const deleteResena = async (req, res) => {
  const { resena_id } = req.params;

  try {
    const reseña = await Resena.findByPk(resena_id);
    if (!reseña) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    await reseña.destroy();
    return res.status(200).json({ message: 'Reseña eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    return res.status(500).json({
      message: 'Error al eliminar la reseña',
      error: error.message
    });
  }
};

module.exports = {
  getResenasByPropiedad,
  createResena,
  getPromedioResenas,
  deleteResena
};
