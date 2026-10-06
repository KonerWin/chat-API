const express = require('express');
const router = express.Router();
const {
  createChat,
  getChats
} = require('../controllers/chatController');

router.route('/')
  .post(createChat)
  .get(getChats);

module.exports = router;
