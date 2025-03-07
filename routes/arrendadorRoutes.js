const express = require('express');
const router = express.Router();
const arrendadorController = require('../controllers/arrendadorController');

router.get('/arrendador', arrendadorController.getArrendadores);
router.post('/arrendador', arrendadorController.createArrendador);
router.delete('/arrendador/:id', arrendadorController.deleteArrendador);

module.exports = router;
