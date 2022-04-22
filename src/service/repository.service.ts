import pkg from '@prisma/client';
import { ChatUpdateObject, NewChatInputObject, User, UserFindObject } from '../types';
const { PrismaClient } = pkg;

class RepositoryService {
    static readonly prisma = new PrismaClient();

    static async findChatById(id: number, senderId: number) {
        const chat = await RepositoryService.prisma.chat.findFirst({
            where: {
                AND: {
                    id,
                    participantsId: {
                        some: {
                            id: {
                                in: [senderId]
                            }
                        }
                    }
                }
            },
            include: {
                messages: {
                    include: {
                        sender: {
                            select: {
                                email: true
                            }
                        }
                    }
                }
            }
        });
        return chat;
    }

    static async findByEmail(email: string) {
        const userExists = await RepositoryService.prisma.user.findFirst({
            where: {
                email
            }
        });
        return userExists;
    }

    static async findByEmailAndPass({ email, password }: UserFindObject) {
        const user = await RepositoryService.prisma.user.findFirst({
            where: {
                email,
                password
            }
        });
        return user;
    }

    static async findUserById(id: number) {
        const user = await RepositoryService.prisma.user.findFirst({
            where: {
                id: id
            },
        });
        return user;
    }

    static async getUserChats(id: number) {
        const foundChat = await RepositoryService.prisma.chat.findMany({
            where: {
                participantsId: {
                    some: {
                        id: {
                            in: [id]
                        }
                    }
                }
            },
            include: {
                participantsId: {
                    select: {
                        id: true,
                        email: true,
                        online: true
                    }
                }
            }
        });
        return foundChat;
    }

    static async getSpecificChat(usersArray: number[]) {
        const chat = await RepositoryService.prisma.chat.findMany({
            where: {
                participantsId: {
                    some: {
                        id: {
                            in: usersArray
                        }
                    }
                }
            }
        });
        return chat;
    }

    static async createUser({name, lastname, email, password}: User) {
        const user = await RepositoryService.prisma.user.create({
            data: {
                name,
                lastname,
                email,
                password,
            }
        });
        return user;
    }

    static async getAllUsers() {
        const allUsers = await RepositoryService.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                online: true,   
            }
        });
        return allUsers;
    }

    static async getOnlineUsers() {
        const onlineUsers = await RepositoryService.prisma.user.findMany({
            where: {
                online: true
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                online: true,   
            }
        });
        return onlineUsers;
    }

    static async getUserById(id: number) {
        const user = await RepositoryService.prisma.user.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                online: true,
            }
        });
        return user;
    }

    static async createNewChat({ message, senderId, recepientId }: NewChatInputObject) {
        await RepositoryService.prisma.chat.create({
            data: {
                messages: {
                    create: {
                        content: message,
                        senderId: senderId
                    }
                },
                participantsId: {
                    connect: [
                        { id: senderId },
                        { id: recepientId }
                    ]
                }
            }
        });
    }

    static async updateChat({ chatId, senderId, message }: ChatUpdateObject) {
        await RepositoryService.prisma.chat.update({
            where: {
                id: chatId
            },
            data: {
                messages: {
                    create: {
                        content: message,
                        senderId: senderId
                    }
                }
            }
        });
    }
}

export default RepositoryService;