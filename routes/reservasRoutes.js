// routes/reservasRoutes.js
const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservasControllers');

// Rutas básicas CRUD sin autenticación
router.post('/reserva', reservaController.crearReserva);
router.get('/reserva', reservaController.obtenerReservas);
router.get('/reserva/:id', reservaController.obtenerReservaPorId);
router.put('/reserva/:id', reservaController.actualizarReserva);
router.delete('/reserva/:id', reservaController.eliminarReserva);

// Rutas específicas
router.post('/reserva/:id/cancelar', reservaController.cancelarReserva);
router.post('/reserva/:id/confirmar', reservaController.confirmarReserva);

module.exports = router;