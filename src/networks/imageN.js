const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos
app.use('/images', express.static(path.join(__dirname, 'images')));

// Endpoint para obtener todas las imágenes
app.get('/api/images', (req, res) => {
    fs.readdir(path.join(__dirname, 'images'), (err, files) => {
        if (err) {
            return res.status(500).send('Error reading images directory');
        }
        const images = files.map(file => ({
            filename: file,
            url: `http://localhost:${port}/images/${file}`
        }));
        res.json(images);
    });
});

// Endpoint para obtener una imagen por nombre de archivo
app.get('/api/images/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'images', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Image not found');
    }
});

// Endpoint para eliminar una imagen por nombre de archivo
app.delete('/api/images/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'images', req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).send('Error deleting image');
            }
            res.status(200).send('Image deleted');
        });
    } else {
        res.status(404).send('Image not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});