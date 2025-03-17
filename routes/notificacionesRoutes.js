const express = require('express');
const router = express.Router();
const NotificacionController = require('../controllers/notificacionesController'); // Asegúrate de que la ruta es correcta

router.post('/notificacion', NotificacionController.crearNotificacion);
router.get('/notificacion', NotificacionController.obtenerNotificaciones);
router.get('/notificacion/:id', NotificacionController.obtenerNotificacionPorId);
router.put('/notificacion/:id', NotificacionController.actualizarNotificacion);
router.delete('/notificacion/:id', NotificacionController.eliminarNotificacion);

module.exports = router;