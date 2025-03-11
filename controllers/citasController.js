const { Cita } = require('../models');

// Obtener todas las citas
const getAllCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll();
    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una cita por ID
const getCitaById = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(cita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva cita
const createCita = async (req, res) => {
  try {
    const cita = await Cita.create(req.body);
    res.status(201).json(cita);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar una cita
const updateCita = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

    await cita.update(req.body);
    res.json(cita);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una cita
const deleteCita = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

    await cita.destroy();
    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCitas,
  getCitaById,
  createCita,
  updateCita,
  deleteCita
};
