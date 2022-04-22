import express from 'express';
import UserController from '../../controller/user.controller.js';
import authChecker from '../../middleware/authChecker.js';

const router = express.Router();

router.get('/', authChecker, UserController.getAllUsers);

router.get('/online', authChecker, UserController.getOnlineUsers);

router.get('/:id', authChecker, UserController.getUserById);


export default router;
    