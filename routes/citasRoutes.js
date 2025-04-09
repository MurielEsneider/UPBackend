const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citasController');

router.get('/cita', citaController.getAllCitas);
router.get('/cita/:id', citaController.getCitaById);
router.post('/cita', citaController.createCita);
router.put('/cita/:id', citaController.updateCita);
router.put('/cita/:id/aceptar', citaController.aceptarCita);
router.put('/cita/:id/cancelar', citaController.cancelarCita);
router.delete('/cita/:id', citaController.deleteCita);

module.exports = router;
