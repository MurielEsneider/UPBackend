const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservasControllers');

// Rutas del CRUD
router.post('/reserva/', reservaController.crearReserva);
router.get('/reserva/', reservaController.obtenerReservas);
router.get('/reserva/:id', reservaController.obtenerReservaPorId);
router.put('/reserva/:id', reservaController.actualizarReserva);
router.delete('/reserva/:id', reservaController.eliminarReserva);

// Nuevas rutas para aceptar y cancelar reservas
router.put('/reserva/:id/aceptar', reservaController.aceptarReserva);
router.put('/reserva/:id/cancelar', reservaController.cancelarReserva);

module.exports = router;
