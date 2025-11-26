import { prisma } from '../index';
import { NotificationType } from '@prisma/client';
import { io } from '../index';

interface SendNotificationData {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
}

export class NotificationService {
    /**
     * Enviar notificación (DB + Push + Socket)
     */
    static async sendNotification(notificationData: SendNotificationData) {
        const { userId, type, title, message, data } = notificationData;

        // Guardar en base de datos
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                data,
            },
        });

        // Emitir evento de socket en tiempo real
        io.to(`user:${userId}`).emit('notification', notification);

        // Enviar push notification
        await this.sendPushNotification(userId, title, message, data);

        return notification;
    }

    /**
     * Enviar push notification usando FCM
     */
    private static async sendPushNotification(
        userId: string,
        title: string,
        message: string,
        data?: any
    ) {
        try {
            // Obtener tokens de dispositivos del usuario
            const deviceTokens = await prisma.deviceToken.findMany({
                where: { userId },
                select: { token: true, platform: true },
            });

            if (deviceTokens.length === 0) {
                return;
            }

            // En producción, usar Firebase Admin SDK
            // Por ahora solo logging
            console.log(`📲 Push notification para usuario ${userId}:`, {
                title,
                message,
                tokens: deviceTokens.length,
            });

            // Implementación con FCM:
            // const admin = require('firebase-admin');
            // const tokens = deviceTokens.map(dt => dt.token);
            // await admin.messaging().sendMulticast({
            //   tokens,
            //   notification: { title, body: message },
            //   data,
            // });
        } catch (error) {
            console.error('Error enviando push notification:', error);
        }
    }

    /**
     * Obtener notificaciones del usuario
     */
    static async getUserNotifications(
        userId: string,
        page: number = 1,
        limit: number = 20
    ) {
        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.notification.count({
                where: { userId },
            }),
        ]);

        const unreadCount = await prisma.notification.count({
            where: { userId, isRead: false },
        });

        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            unreadCount,
        };
    }

    /**
     * Marcar notificación como leída
     */
    static async markAsRead(notificationId: string, userId: string) {
        return await prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                isRead: true,
            },
        });
    }

    /**
     * Marcar todas como leídas
     */
    static async markAllAsRead(userId: string) {
        return await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }

    /**
     * Registrar token de dispositivo
     */
    static async registerDeviceToken(
        userId: string,
        token: string,
        platform: string
    ) {
        // Verificar si el token ya existe
        const existing = await prisma.deviceToken.findUnique({
            where: { token },
        });

        if (existing) {
            // Actualizar userId si cambió
            if (existing.userId !== userId) {
                return await prisma.deviceToken.update({
                    where: { token },
                    data: { userId, platform },
                });
            }
            return existing;
        }

        // Crear nuevo token
        return await prisma.deviceToken.create({
            data: {
                userId,
                token,
                platform,
            },
        });
    }
}
