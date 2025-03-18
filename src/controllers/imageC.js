const cloudflareService = require('../services/cloudFlare');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Configuración de multer para almacenar temporalmente las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../upload');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const encryptedName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
        cb(null, encryptedName);
    }
});

const upload = multer({ storage: storage });

exports.uploadImage = upload.single('image');

exports.uploadImageHandler = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    try {
        const result = await cloudflareService.uploadImage(req.file.path);
        fs.unlinkSync(req.file.path); // Eliminar el archivo temporal
        res.status(200).send(result);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('An error occurred while uploading the image');
        }
    }
};

exports.getAllImages = async (req, res) => {
    try {
        const result = await cloudflareService.getAllImages();
        console.log(result); // Verifica la estructura de la respuesta
        if (result.success && Array.isArray(result.result.images)) {
            const images = result.result.images.map(image => ({
                id: image.id,
                variants: [
                    `https://imagedelivery.net/jJ__hVGQz0ODLVphVt4EtA/${image.id}/250`,
                    `https://imagedelivery.net/jJ__hVGQz0ODLVphVt4EtA/${image.id}/500`,
                    `https://imagedelivery.net/jJ__hVGQz0ODLVphVt4EtA/${image.id}/750`
                ]
            }));
            res.status(200).json({ result: images });
        } else {
            res.status(500).send('Unexpected response format');
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('An error occurred while fetching images');
        }
    }
};
exports.getImage = async (req, res) => {
    try {
        const result = await cloudflareService.getImage(req.params.imageId);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error fetching image:', error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('An error occurred while fetching the image');
        }
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const result = await cloudflareService.deleteImage(req.params.imageId);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error deleting image:', error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('An error occurred while deleting the image');
        }
    }
};