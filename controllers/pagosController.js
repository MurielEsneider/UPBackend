const { Pago } = require('../models');

// Obtener todos los pagos
exports.getAllPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un pago por ID
exports.getPagoById = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json(pago);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo pago
exports.createPago = async (req, res) => {
  try {
    const pago = await Pago.create(req.body);
    res.status(201).json(pago);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un pago
exports.updatePago = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });

    await pago.update(req.body);
    res.json(pago);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un pago
exports.deletePago = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });

    await pago.destroy();
    res.json({ message: 'Pago eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
