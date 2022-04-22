import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import SocketioService from '../service/socketio.service.js';

export default function(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>){
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            SocketioService.switchUserOffline(socket, io);
        });
        socket.on('private_message', (msg) => {
            SocketioService.privateMessage(socket, msg);
        });
        socket.on('login', (ctx) => {
            SocketioService.switchUserOnline(socket, ctx, io);
            
        });
        socket.on('manual_disconnect', () => {
            SocketioService.switchUserOffline(socket, io);
        });
    });
}