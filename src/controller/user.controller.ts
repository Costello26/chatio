import { Request, Response, NextFunction} from 'express';
import { UserGetByIdRequest, UserSignupRequest } from '../types';
import pkg from '@prisma/client';
import RepositoryService from '../service/repository.service.js';
const { PrismaClient } = pkg;   

class UserController {

    static readonly prisma = new PrismaClient();

    static async signup(req: UserSignupRequest, res: Response, next: NextFunction){
        try{
            const { name, lastname, email, password } = req.body;
            const userExists = await RepositoryService.findByEmail(email);
            if(userExists)
                return res.status(403).json({error: 'Credentials already taken'});
            const user = await RepositoryService.createUser({
                    name,
                    lastname,
                    email,
                    password,
            });
            return res.status(200).json(user);
        } catch(err){
            return next(err);
        }
    }


    static async getAllUsers(req: Request, res: Response, next: NextFunction){
        try{
            const allUsers = await RepositoryService.getAllUsers();
            return res.status(200).json(allUsers);
        } catch(err){
            return next(err);
        }
    }

    
    static async getUserById(req: UserGetByIdRequest, res: Response, next: NextFunction){
        try{
            const id: string = req.params.id;
            const user = await RepositoryService.getUserById(+id);
            return res.status(200).json(user);
        } catch(err){
            return next(err);
        }
    }


    static async getOnlineUsers(req: Request, res: Response, next: NextFunction){
        try{
            const onlineUsers = await RepositoryService.getOnlineUsers();
            return res.status(200).json(onlineUsers);
        } catch(err){
            return next(err);
        }
    }
}

export default UserController;