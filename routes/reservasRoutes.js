const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservasControllers');

// Crear una nueva reserva
router.post('/reserva', reservaController.crearReserva);

// Obtener todas las reservas
router.get('/reserva', reservaController.obtenerReservas);

// Obtener una reserva por ID
router.get('/reserva/:id', reservaController.obtenerReservaPorId);

// Eliminar una reserva
router.delete('/reserva/:id', reservaController.eliminarReserva);

// Aceptar una reserva
router.put('/reserva/:id/aceptar', reservaController.aceptarReserva);
router.put('/reserva/:id/cancelar', reservaController.cancelarReserva);

// Obtener reservas por usuario
router.get('/reserva/usuario/:usuario_uid', reservaController.obtenerReservasPorUsuario);
router.get('/reserva/propiedad/:propiedad_id', reservaController.obtenerReservasPorPropiedad);

module.exports = router;
