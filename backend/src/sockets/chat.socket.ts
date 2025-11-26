import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

interface AuthenticatedSocket extends Socket {
    userId?: string;
    userRole?: string;
}

export const initializeSocketHandlers = (io: Server) => {
    // Middleware de autenticación para Socket.io
    io.use(async (socket: AuthenticatedSocket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            // Verificar token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            ) as { userId: string; role: string };

            // Verificar usuario
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user || !user.isActive) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.userId = user.id;
            socket.userRole = user.role;

            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket: AuthenticatedSocket) => {
        console.log(`✅ Usuario conectado: ${socket.userId}`);

        // Unir a la sala del usuario para notificaciones
        socket.join(`user:${socket.userId}`);

        // Unirse a un chat de solicitud de servicio
        socket.on('join_chat', async (data: { serviceRequestId: string }) => {
            try {
                const { serviceRequestId } = data;

                // Verificar que el usuario tiene acceso a este chat
                const serviceRequest = await prisma.serviceRequest.findUnique({
                    where: { id: serviceRequestId },
                });

                if (!serviceRequest) {
                    socket.emit('error', { message: 'Solicitud de servicio no encontrada' });
                    return;
                }

                if (
                    serviceRequest.clientId !== socket.userId &&
                    serviceRequest.professionalId !== socket.userId
                ) {
                    socket.emit('error', { message: 'No autorizado' });
                    return;
                }

                // Unirse a la sala del chat
                socket.join(`chat:${serviceRequestId}`);
                console.log(`Usuario ${socket.userId} unido a chat ${serviceRequestId}`);

                socket.emit('joined_chat', { serviceRequestId });
            } catch (error) {
                console.error('Error en join_chat:', error);
                socket.emit('error', { message: 'Error al unirse al chat' });
            }
        });

        // Enviar mensaje
        socket.on('send_message', async (data: { serviceRequestId: string; content: string }) => {
            try {
                const { serviceRequestId, content } = data;

                if (!content || content.trim().length === 0) {
                    socket.emit('error', { message: 'El mensaje no puede estar vacío' });
                    return;
                }

                // Verificar acceso
                const serviceRequest = await prisma.serviceRequest.findUnique({
                    where: { id: serviceRequestId },
                });

                if (!serviceRequest) {
                    socket.emit('error', { message: 'Solicitud de servicio no encontrada' });
                    return;
                }

                if (
                    serviceRequest.clientId !== socket.userId &&
                    serviceRequest.professionalId !== socket.userId
                ) {
                    socket.emit('error', { message: 'No autorizado' });
                    return;
                }

                // Crear mensaje en la base de datos
                const message = await prisma.message.create({
                    data: {
                        serviceRequestId,
                        senderId: socket.userId!,
                        content: content.trim(),
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePhoto: true,
                            },
                        },
                    },
                });

                // Emitir mensaje a todos en la sala del chat
                io.to(`chat:${serviceRequestId}`).emit('message_received', message);

                // Determinar el destinatario
                const recipientId =
                    serviceRequest.clientId === socket.userId
                        ? serviceRequest.professionalId
                        : serviceRequest.clientId;

                // Enviar notificación al destinatario
                io.to(`user:${recipientId}`).emit('notification', {
                    type: 'NEW_MESSAGE',
                    title: 'Nuevo mensaje',
                    message: `${message.sender.firstName} te envió un mensaje`,
                    data: { serviceRequestId, messageId: message.id },
                });
            } catch (error) {
                console.error('Error en send_message:', error);
                socket.emit('error', { message: 'Error al enviar mensaje' });
            }
        });

        // Indicador de escritura
        socket.on('typing', (data: { serviceRequestId: string; isTyping: boolean }) => {
            const { serviceRequestId, isTyping } = data;
            socket.to(`chat:${serviceRequestId}`).emit('user_typing', {
                userId: socket.userId,
                isTyping,
            });
        });

        // Marcar mensajes como leídos
        socket.on('read_messages', async (data: { serviceRequestId: string }) => {
            try {
                const { serviceRequestId } = data;

                await prisma.message.updateMany({
                    where: {
                        serviceRequestId,
                        senderId: { not: socket.userId },
                        isRead: false,
                    },
                    data: {
                        isRead: true,
                    },
                });

                socket.to(`chat:${serviceRequestId}`).emit('messages_read', {
                    userId: socket.userId,
                });
            } catch (error) {
                console.error('Error en read_messages:', error);
            }
        });

        // Desconexión
        socket.on('disconnect', () => {
            console.log(`❌ Usuario desconectado: ${socket.userId}`);
        });
    });

    console.log('🔌 Socket.io handlers initialized');
};
