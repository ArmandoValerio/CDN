const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageC');

// Ruta raíz
router.get('/', (req, res) => {
    res.send('Welcome to the CDN API');
});

// Rutas para obtener y eliminar imágenes por ID
router.get('/images', imageController.getAllImages);
router.get('/images/:imageId', imageController.getImage);
router.delete('/images/:imageId', imageController.deleteImage);

// Ruta para subir imágenes
router.post('/images', imageController.uploadImage, imageController.uploadImageHandler);

module.exports = router;