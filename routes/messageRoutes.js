const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessagesByChatId
} = require('../controllers/messageController');

router.route('/')
  .post(createMessage);

router.route('/:chatId')
  .get(getMessagesByChatId);

module.exports = router;
