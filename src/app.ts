import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import chalk from 'chalk';
import apiRoutes from './route/api/root.js';
import errorLogger from './middleware/errorLogger.js';
import socketioDriver from './controller/socket.controller.js';
import { Server } from 'socket.io';
import morgan from 'morgan';

dotenv.config();
import config from './config/index.js';
export const io = new Server(http.createServer(express()), {cors: {origin: "*"}});

class ChatApplication {
    private readonly app = express();
    private readonly server = http.createServer(this.app);
    private readonly routes = apiRoutes;
    private readonly io = io;
    private readonly socketDriver = socketioDriver;
    private readonly errorLogger = errorLogger;

    main(): void {
        const app = this.app;
        morgan('tiny');

        app.use(cors());
        app.use('/public', express.static('static'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use('/api/v1', this.routes);

        this.socketDriver(this.io);

        app.get('/', (req, res) => {
            res.sendStatus(200);
        });

        app.use('*', (req, res) => {
            res.sendStatus(404);
        });

        //app.use(this.errorLogger);
        this.start();
    }
    start(): void {
        const server = this.server;
        server.listen(config.port, async() => {
            console.log(chalk.green(`Server listening on port ${config.port}...`));
        });
    }
}

const app = new ChatApplication();
app.main();




