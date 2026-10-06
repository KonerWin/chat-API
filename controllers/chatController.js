const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const User = require('../models/User');

const createChat = async (req, res, next) => {
  try {
    const { nombre, participantes } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'El campo "nombre" del chat es obligatorio'
      });
    }

    if (!participantes || !Array.isArray(participantes) || participantes.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'El campo "participantes" debe ser un array con al menos un usuario'
      });
    }

    const invalidIds = participantes.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `Los siguientes identificadores no son válidos: ${invalidIds.join(', ')}`
      });
    }

    const uniqueParticipants = [...new Set(participantes.map((id) => id.toString()))];

    const existingUsers = await User.find({ _id: { $in: uniqueParticipants } });
    if (existingUsers.length !== uniqueParticipants.length) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Uno o más participantes proporcionados no existen en la base de datos'
      });
    }

    const newChat = await Chat.create({
      nombre: nombre.trim(),
      participantes: uniqueParticipants
    });

    const populatedChat = await Chat.findById(newChat._id).populate('participantes', 'nombre email');

    return res.status(201).json({
      success: true,
      data: populatedChat,
      message: 'Chat creado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find()
      .populate('participantes', 'nombre email')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: chats,
      message: 'Lista de chats obtenida exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChat,
  getChats
};
