const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  deleteUser
} = require('../controllers/userController');

router.route('/')
  .post(createUser)
  .get(getUsers);

router.route('/:id')
  .delete(deleteUser);

module.exports = router;
