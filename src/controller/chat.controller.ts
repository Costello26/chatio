import pkg from '@prisma/client';
import { Response, NextFunction } from 'express';
import { io } from '../app.js';
import RepositoryService from '../service/repository.service.js';
import { ExReq } from '../types/index.js';
import config from '../config/index.js';
const { PrismaClient } = pkg;

class ChatController {
    static readonly prisma = new PrismaClient();

    static async getChat(req: ExReq, res: Response, next: NextFunction) {
        try {
            if(!req.user || !req.user.id)
                return res.status(401).json({ error: "unauthorized" });
            const { chatId } = req.params;
            const foundChat = await RepositoryService.findChatById(+chatId, req.user.id);
            if(!foundChat)
                return res.status(404).json({error: 'chat not found'});
            return res.status(200).json(foundChat);
        } catch(err) {
            next(err);
        }
    }

    static async getMyChats(req: ExReq, res: Response, next: NextFunction) {
        try{
            //extract all user's chats from db
            if(!req.user || !req.user.id)
                return res.status(401).json({error: "unauthorized"});
            const foundChats = await RepositoryService.getUserChats(req.user.id);
            if(!foundChats)
                return res.status(404).json({error: 'chat not found'});
            return res.status(200).json(foundChats);
        } catch(err) {
            next(err);
        }
    }

    static async sendMessage(req: ExReq, res: Response, next: NextFunction) {
        try {
            
            //exptracting request body
            const { recepientId, message } = req.body;
            if(!recepientId || !message)
                return res.status(400).json({error: 'bad request'});

            if(!req.user || !req.user.id)
                return res.status(401).json({error: 'unauthorized'});
            const user = req.user;
            if(!user || !user.id)
                return res.status(401).json({error: 'unauthorized'});


            //check recepient exists in db
            const recepient = await RepositoryService.findUserById(+recepientId);
            if(!recepient)
                return res.status(404).json({ error: 'recepient not found' });

            //get chat from db 
            const chat = await RepositoryService.getSpecificChat([user.id, recepient.id]);

            //or create it is not exists
            if(!chat || chat.length <= 0) {
                await RepositoryService.createNewChat({ message, senderId: user.id, recepientId: recepient.id});
                return res.sendStatus(200);
            }

            //update chat if it found in db
            await RepositoryService.updateChat({ chatId: chat[0].id, senderId: user.id, message });

            io.emit('private_message', { id: recepient.id, from: user.email});
            return res.sendStatus(200);
        } catch(err) {
            next(err);
        }
    }

    static async sendFile(req: ExReq, res: Response, next: NextFunction) {
        try {
            const fileUrl = `${config.attachmentsDirectory}${req.file?.filename}`;
            const fileMessage = `New file: ${fileUrl}`;
            console.log(fileUrl);

            if(!req.user || !req.user.id)
                return res.status(401).json({error: 'unauthorized'});

            //get chat from db 
            const chat = await RepositoryService.getSpecificChat([req.user.id, +req.params.recepientId]);

            //or create it is not exists
            if(!chat || chat.length <= 0) {
                await RepositoryService.createNewChat({ message: fileMessage, senderId: req.user.id, recepientId: +req.params.recepientId});
                return res.sendStatus(200);
            }

            //update chat if it found in db
            await RepositoryService.updateChat({ chatId: chat[0].id, senderId: req.user.id, message: fileMessage });

            io.emit('private_message', { id: +req.params.id, from: req.user.email});

            res.sendStatus(200);
        } catch(err) {
            next(err);
        }
    }

}

export default ChatController;