const express = require('express');
const router = express.Router();
const imageRouter = require('../controllers/imagesController');

router.get('/images', imageRouter.saveUrlImages);


module.exports = router;
