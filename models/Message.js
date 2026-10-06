const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: [true, 'El chatId es un campo obligatorio']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El userId (emisor) es un campo obligatorio']
    },
    contenido: {
      type: String,
      required: [true, 'El contenido del mensaje no puede estar vacío'],
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Message', messageSchema);
