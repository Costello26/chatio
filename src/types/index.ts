import { Request } from "express";

export interface User {
    id?: number,
    name: string,
    lastname: string,
    email: string,
    password: string
}

export interface UserFindObject {
    email: string,
    password: string
}

export interface Message {
    from: string,
    recepientId: string
}

export interface NewChatInputObject {
    message: string,
    senderId: number,
    recepientId: number,
}

export interface ChatUpdateObject {
    message: string,
    senderId: number,
    chatId: number,
}

export type loginData = Pick<User, "email" | "password">

export interface UserSignupRequest extends Request {
    body: {
        name: string, 
        lastname: string, 
        email: string, 
        password: string,
    }
}

export interface UserGetByIdRequest extends Request {
    params: {
        id: string
    }
}

export interface ExReq extends Request {
    user?: User
}

