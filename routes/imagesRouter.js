const express = require('express');
const router = express.Router();
const imageRouter = require('../controllers/imagesController');

router.post('/images', imageRouter.saveUrlImages);
    router.get('/images/:propiedadId', imageRouter.getUrlImagesByPropiedadId);

module.exports = router;