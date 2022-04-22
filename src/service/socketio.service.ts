import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { loginData, Message } from "../types/index.js";
import { Socket, Server } from "socket.io";

export default class SocketioService{
    static prisma = new PrismaClient();

    static async switchUserOnline(socket: Socket, ctx: loginData, io: Server){
        try{
            const { email, password } = ctx;
            const user = await this.prisma.user.findFirst({
                where: {
                    email,
                    password,
                }
            });
            if(!user) 
                return false;
            const correspondPassword = password == user.password && email == user.password;
            if(!correspondPassword)
                return false;
            await this.prisma.user.update({
                where: {
                    email,
                },
                data: {
                    online: true,
                    socketId: socket.id,
                }
            });
            io.sockets.emit('reload_online_users');
            return true;
        } catch(err){
            console.log(err);
        }
    }


    static async switchUserOffline(socket: Socket, io: Server){
        try{
            const { id } = socket;
            const foundUser = await this.prisma.user.findFirst({
                where: {
                    socketId: id
                }
            });
            if(!foundUser)
                return false;
            const userToOffline = await this.prisma.user.update({
                where: {
                    id: foundUser.id
                },
                data: {
                    online: false,
                    socketId: null
                }
            });
            if(!userToOffline){
                return false;
            }
            io.sockets.emit('reload_online_users');
            return true;
        } catch(err){
            console.log(err);
        }
    }


    static async privateMessage(socket: Socket, msg: Message){
        try{
            const { recepientId, from } = msg;
            if(recepientId)
                return false;
                
            const recepient = await this.prisma.user.findFirst({
                where: {
                    id: +recepientId
                }
            });
            if(!recepient || !recepient.socketId)
                return false;

            socket.to(recepient.socketId).emit('get_message', from);
        } catch(err){
            console.log(err);
        }
    }
}