import express from 'express';
import ChatController from '../../controller/chat.controller.js';
import authChecker from '../../middleware/authChecker.js';
import config from '../../config/index.js';
import sendFileChecker from '../../middleware/sendFileChecker.js';

const { upload } = config;

const router = express.Router();

router.get('/my', authChecker, ChatController.getMyChats);

router.get('/:chatId', authChecker, ChatController.getChat);

router.post('/', authChecker, ChatController.sendMessage);

router.post('/file/:recepientId', authChecker, sendFileChecker, upload.single('file') , ChatController.sendFile);


export default router;
