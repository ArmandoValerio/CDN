const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;
const routes = require('./src/routes');

// Middleware para registrar solicitudes HTTP
app.use(morgan('dev'));

// Middleware para servir archivos estáticos
app.use('/upload', express.static('upload'));
app.use(express.static('public'));

// Usar las rutas definidas
app.use('/api', routes);

// Ruta raíz
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});