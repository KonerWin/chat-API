require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

// Importación de rutas
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Importación de middlewares
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

// Inicialización de la aplicación Express
const app = express();

// Conexión a la base de datos MongoDB
connectDB();

// Middlewares globales de parseo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta base / de bienvenida y estado del servicio
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      api: 'Chat API REST',
      version: '1.0.0',
      status: 'online'
    },
    message: 'Servicio de Chat API en funcionamiento'
  });
});

// Registro de endpoints principales
app.use('/users', userRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

// Manejo de rutas inexistentes (404)
app.use(notFoundHandler);

// Middleware centralizado de manejo global de errores
app.use(errorHandler);

// Definición de puerto y arranque del servidor
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Servidor corriendo en el puerto : ${PORT}`);
  console.log(` Entorno                         : ${process.env.NODE_ENV || 'development'}`);
  console.log(` URL Local                       : http://localhost:${PORT}`);
  console.log(`===============================================`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error(`[UnhandledRejection] Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
