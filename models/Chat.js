const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del chat es un campo obligatorio'],
      trim: true
    },
    participantes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Chat', chatSchema);
