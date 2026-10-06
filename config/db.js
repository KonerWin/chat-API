const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/chat_db';

    const conn = await mongoose.connect(mongoUri);

    console.log(`[MongoDB] Conectado exitosamente al host: ${conn.connection.host}`);
    console.log(`[MongoDB] Base de datos activa: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Error al conectar a la base de datos: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
