const mongoose = require('mongoose');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

const createMessage = async (req, res, next) => {
  try {
    const { chatId, userId, contenido } = req.body;

    if (!chatId || !userId || !contenido || !contenido.trim()) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Los campos "chatId", "userId" y "contenido" son obligatorios'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `El chatId '${chatId}' no es un ObjectId válido de MongoDB`
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `El userId '${userId}' no es un ObjectId válido de MongoDB`
      });
    }


    const chatExists = await Chat.findById(chatId);
    if (!chatExists) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `No se encontró ningún chat con el ID '${chatId}'`
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `No se encontró ningún usuario con el ID '${userId}'`
      });
    }

    const isParticipant = chatExists.participantes.some(
      (participantId) => participantId.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        data: null,
        message: 'El usuario especificado no es un participante registrado en este chat'
      });
    }

    const newMessage = await Message.create({
      chatId,
      userId,
      contenido: contenido.trim()
    });

    const populatedMessage = await Message.findById(newMessage._id).populate('userId', 'nombre email');

    return res.status(201).json({
      success: true,
      data: populatedMessage,
      message: 'Mensaje enviado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

const getMessagesByChatId = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `El chatId '${chatId}' no es un ObjectId válido de MongoDB`
      });
    }

    const chatExists = await Chat.findById(chatId);
    if (!chatExists) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `No se encontró ningún chat con el ID '${chatId}'`
      });
    }

    const messages = await Message.find({ chatId })
      .populate('userId', 'nombre email')
      .sort({ createdAt: 1 }); // Orden cronológico ascendente (los más antiguos primero)

    return res.status(200).json({
      success: true,
      data: messages,
      message: 'Historial de mensajes obtenido exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getMessagesByChatId
};
