const mongoose = require('mongoose');
const User = require('../models/User');


const createUser = async (req, res, next) => {
  try {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Los campos "nombre" y "email" son obligatorios'
      });
    }

    const newUser = await User.create({ nombre, email });

    return res.status(201).json({
      success: true,
      data: newUser,
      message: 'Usuario creado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users,
      message: 'Lista de usuarios obtenida exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `El ID '${id}' no es un ObjectId válido de MongoDB`
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `No se encontró ningún usuario con el ID '${id}'`
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedUser,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  deleteUser
};
