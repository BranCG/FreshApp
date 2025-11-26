import { Router } from 'express';
import { query } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { prisma } from '../index';

const router = Router();

// Obtener historial de chat
router.get(
    '/:serviceRequestId/messages',
    authenticate,
    validate([
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 }),
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const { serviceRequestId } = req.params;
            const { page = 1, limit = 50 } = req.query;
            const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

            // Verificar acceso
            const serviceRequest = await prisma.serviceRequest.findUnique({
                where: { id: serviceRequestId },
            });

            if (!serviceRequest) {
                return res.status(404).json({ error: 'Solicitud no encontrada' });
            }

            if (
                serviceRequest.clientId !== req.userId &&
                serviceRequest.professionalId !== req.userId
            ) {
                return res.status(403).json({ error: 'No autorizado' });
            }

            // Obtener mensajes
            const messages = await prisma.message.findMany({
                where: { serviceRequestId },
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
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit as string),
            });

            res.json({ messages: messages.reverse() });
        } catch (error) {
            next(error);
        }
    }
);

// Enviar mensaje (REST fallback, principalmente se usa WebSocket)
router.post(
    '/:serviceRequestId/messages',
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            const { serviceRequestId } = req.params;
            const { content } = req.body;

            // Verificar acceso
            const serviceRequest = await prisma.serviceRequest.findUnique({
                where: { id: serviceRequestId },
            });

            if (!serviceRequest) {
                return res.status(404).json({ error: 'Solicitud no encontrada' });
            }

            if (
                serviceRequest.clientId !== req.userId &&
                serviceRequest.professionalId !== req.userId
            ) {
                return res.status(403).json({ error: 'No autorizado' });
            }

            // Crear mensaje
            const message = await prisma.message.create({
                data: {
                    serviceRequestId,
                    senderId: req.userId!,
                    content,
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

            res.status(201).json(message);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
