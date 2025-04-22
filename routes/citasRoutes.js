const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citasController');

// Crear una nueva cita
router.post('/citas', citaController.crearCita);

// Aceptar o cancelar una cita (usando cita_id)
router.put('/citas/:cita_id/aceptar', citaController.aceptarCita);
router.put('/citas/:cita_id/cancelar', citaController.cancelarCita);

// Obtener todas las citas
router.get('/citas', citaController.obtenerCitas);

// Obtener una cita por cita_id
router.get('/citas/:cita_id', citaController.obtenerCitaPorId);

// Obtener citas por usuario o propiedad
router.get('/citas/usuario/:usuario_uid', citaController.obtenerCitasPorUsuario);
router.get('/citas/propiedad/:propiedad_id', citaController.obtenerCitasPorPropiedad);

// Eliminar una cita
router.delete('/citas/:cita_id', citaController.eliminarCita);

module.exports = router;
