import { Router } from 'express';
import { body, query } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { prisma } from '../index';
import { AppError } from '../middleware/error-handler.middleware';
import { NotificationService } from '../services/notification.service';
import { ServiceRequestStatus } from '@prisma/client';

const router = Router();

// Crear solicitud de servicio
router.post(
    '/',
    authenticate,
    validate([
        body('professionalId').isUUID(),
        body('category').isIn(['BARBER', 'TATTOO_ARTIST', 'MANICURIST']),
        body('requestedDate').isISO8601(),
        body('clientAddress').notEmpty(),
        body('clientLatitude').isFloat(),
        body('clientLongitude').isFloat(),
        body('estimatedPrice').isFloat({ min: 0 }),
        body('description').optional().isString(),
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const {
                professionalId,
                category,
                requestedDate,
                clientAddress,
                clientLatitude,
                clientLongitude,
                estimatedPrice,
                description,
            } = req.body;

            // Verificar que el profesional existe y está disponible
            const professional = await prisma.professional.findUnique({
                where: { userId: professionalId },
                include: { user: true },
            });

            if (!professional) {
                throw new AppError('Profesional no encontrado', 404);
            }

            if (!professional.isAvailable) {
                throw new AppError('El profesional no está disponible en este momento', 400);
            }

            // Crear solicitud
            const serviceRequest = await prisma.serviceRequest.create({
                data: {
                    clientId: req.userId!,
                    professionalId,
                    category,
                    requestedDate: new Date(requestedDate),
                    clientAddress,
                    clientLatitude,
                    clientLongitude,
                    estimatedPrice,
                    description,
                    status: ServiceRequestStatus.PENDING,
                },
                include: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true,
                            profilePhoto: true,
                        },
                    },
                    professional: {
                        select: {
                            firstName: true,
                            lastName: true,
                            profilePhoto: true,
                        },
                    },
                },
            });

            // Enviar notificación al profesional
            await NotificationService.sendNotification({
                userId: professionalId,
                type: 'SERVICE_REQUEST',
                title: 'Nueva solicitud de servicio',
                message: `${serviceRequest.client.firstName} ha solicitado un servicio`,
                data: { serviceRequestId: serviceRequest.id },
            });

            res.status(201).json(serviceRequest);
        } catch (error) {
            next(error);
        }
    }
);

// Listar solicitudes
router.get(
    '/',
    authenticate,
    validate([
        query('status').optional().isIn(Object.values(ServiceRequestStatus)),
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 50 }),
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const { status, page = 1, limit = 20, role } = req.query;
            const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

            const where: any = {};

            // Filtrar por rol (si se especifica)
            const roleFilter = (role as string)?.toUpperCase();

            if (roleFilter === 'CLIENT') {
                where.clientId = req.userId;
            } else if (roleFilter === 'PROFESSIONAL') {
                // Verificar permisos
                // Si el usuario no es admin ni profesional, no puede ver como profesional
                // (Aunque aquí asumimos que el userId del token es el mismo que professionalId en User,
                // pero professionalId en ServiceRequest se refiere al User que es profesional?
                // Revisando el schema: professionalId referecia a User. Correcto.)

                // Nota: Podríamos validar req.userRole aquí, pero si no es profesional 
                // simplemente no tendrá professionalId que coincida, así que devolverá vacío. 
                // Pero es mejor ser explícito.
                if (req.userRole !== 'PROFESSIONAL' && req.userRole !== 'ADMIN') {
                    // Si intenta ver como profesional sin serlo.
                    // (Ojo: req.userRole viene del token)
                }
                where.professionalId = req.userId;
            } else {
                // Comportamiento por defecto
                if (req.userRole === 'CLIENT') {
                    where.clientId = req.userId;
                } else if (req.userRole === 'PROFESSIONAL') {
                    // Por defecto el profesional ve sus trabajos
                    where.professionalId = req.userId;
                }
            }

            // Filtrar por estado
            if (status) {
                where.status = status;
            }

            const [serviceRequests, total] = await Promise.all([
                prisma.serviceRequest.findMany({
                    where,
                    include: {
                        client: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profilePhoto: true,
                            },
                        },
                        professional: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profilePhoto: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: parseInt(limit as string),
                }),
                prisma.serviceRequest.count({ where }),
            ]);

            res.json({
                serviceRequests,
                pagination: {
                    page: parseInt(page as string),
                    limit: parseInt(limit as string),
                    total,
                    pages: Math.ceil(total / parseInt(limit as string)),
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener detalles de una solicitud
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const serviceRequest = await prisma.serviceRequest.findUnique({
            where: { id: req.params.id },
            include: {
                client: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        phone: true,
                    },
                },
                professional: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        phone: true,
                    },
                },
                payment: true,
                review: true,
            },
        });

        if (!serviceRequest) {
            throw new AppError('Solicitud no encontrada', 404);
        }

        // Verificar autorización
        if (
            serviceRequest.clientId !== req.userId &&
            serviceRequest.professionalId !== req.userId &&
            req.userRole !== 'ADMIN'
        ) {
            throw new AppError('No autorizado', 403);
        }

        res.json(serviceRequest);
    } catch (error) {
        next(error);
    }
});

// Aceptar solicitud (profesional)
router.patch('/:id/accept', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const serviceRequest = await prisma.serviceRequest.findUnique({
            where: { id: req.params.id },
            include: { client: true },
        });

        if (!serviceRequest) {
            throw new AppError('Solicitud no encontrada', 404);
        }

        if (serviceRequest.professionalId !== req.userId) {
            throw new AppError('No autorizado', 403);
        }

        if (serviceRequest.status !== ServiceRequestStatus.PENDING) {
            throw new AppError('La solicitud ya fue procesada', 400);
        }

        const updated = await prisma.serviceRequest.update({
            where: { id: req.params.id },
            data: {
                status: ServiceRequestStatus.ACCEPTED,
                acceptedAt: new Date(),
            },
        });

        // Notificar al cliente
        await NotificationService.sendNotification({
            userId: serviceRequest.clientId,
            type: 'SERVICE_ACCEPTED',
            title: 'Solicitud aceptada',
            message: 'Tu solicitud ha sido aceptada',
            data: { serviceRequestId: updated.id },
        });

        res.json(updated);
    } catch (error) {
        next(error);
    }
});

// Rechazar solicitud (profesional)
router.patch('/:id/reject', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const { reason } = req.body;

        const serviceRequest = await prisma.serviceRequest.findUnique({
            where: { id: req.params.id },
        });

        if (!serviceRequest) {
            throw new AppError('Solicitud no encontrada', 404);
        }

        if (serviceRequest.professionalId !== req.userId) {
            throw new AppError('No autorizado', 403);
        }

        const updated = await prisma.serviceRequest.update({
            where: { id: req.params.id },
            data: {
                status: ServiceRequestStatus.REJECTED,
                cancellationReason: reason,
            },
        });

        // Notificar al cliente
        await NotificationService.sendNotification({
            userId: serviceRequest.clientId,
            type: 'SERVICE_REJECTED',
            title: 'Solicitud rechazada',
            message: reason || 'El profesional rechazó tu solicitud',
            data: { serviceRequestId: updated.id },
        });

        res.json(updated);
    } catch (error) {
        next(error);
    }
});

// Marcar llegada (profesional)
router.patch('/:id/arrive', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const updated = await prisma.serviceRequest.update({
            where: {
                id: req.params.id,
                professionalId: req.userId,
            },
            data: {
                status: ServiceRequestStatus.ARRIVED,
                arrivedAt: new Date(),
            },
        });

        res.json(updated);
    } catch (error) {
        next(error);
    }
});

// Iniciar servicio (profesional)
router.patch('/:id/start', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const updated = await prisma.serviceRequest.update({
            where: {
                id: req.params.id,
                professionalId: req.userId,
            },
            data: {
                status: ServiceRequestStatus.IN_PROGRESS,
                startedAt: new Date(),
            },
        });

        res.json(updated);
    } catch (error) {
        next(error);
    }
});

// Completar servicio (profesional)
router.patch('/:id/complete', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const serviceRequest = await prisma.serviceRequest.update({
            where: {
                id: req.params.id,
                professionalId: req.userId,
            },
            data: {
                status: ServiceRequestStatus.COMPLETED,
                completedAt: new Date(),
            },
        });

        // Notificar al cliente
        await NotificationService.sendNotification({
            userId: serviceRequest.clientId,
            type: 'SERVICE_COMPLETED',
            title: 'Servicio completado',
            message: 'El servicio ha finalizado. Por favor procede al pago.',
            data: { serviceRequestId: serviceRequest.id },
        });

        res.json(serviceRequest);
    } catch (error) {
        next(error);
    }
});

// Cancelar servicio
router.patch('/:id/cancel', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const { reason } = req.body;

        const serviceRequest = await prisma.serviceRequest.findUnique({
            where: { id: req.params.id },
        });

        if (!serviceRequest) {
            throw new AppError('Solicitud no encontrada', 404);
        }

        // Solo cliente o profesional pueden cancelar
        if (
            serviceRequest.clientId !== req.userId &&
            serviceRequest.professionalId !== req.userId
        ) {
            throw new AppError('No autorizado', 403);
        }

        const updated = await prisma.serviceRequest.update({
            where: { id: req.params.id },
            data: {
                status: ServiceRequestStatus.CANCELLED,
                cancelledAt: new Date(),
                cancellationReason: reason,
            },
        });

        res.json(updated);
    } catch (error) {
        next(error);
    }
});

export default router;
