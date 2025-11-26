import { Router } from 'express';
import { body, query } from 'express-validator';
import { authenticate, AuthRequest, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { prisma } from '../index';
import { AppError } from '../middleware/error-handler.middleware';

const router = Router();

// Todas las rutas requieren autenticación y rol ADMIN
router.use(authenticate);
router.use(authorize('ADMIN'));

// Obtener todos los usuarios
router.get(
    '/users',
    validate([
        query('role').optional().isIn(['CLIENT', 'PROFESSIONAL', 'ADMIN']),
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 }),
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const { role, page = 1, limit = 20 } = req.query;
            const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

            const where: any = {};
            if (role) {
                where.role = role;
            }

            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    where,
                    select: {
                        id: true,
                        email: true,
                        phone: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        role: true,
                        isActive: true,
                        isVerified: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: parseInt(limit as string),
                }),
                prisma.user.count({ where }),
            ]);

            res.json({
                users,
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

// Obtener profesionales pendientes de verificación
router.get('/professionals/pending-verification', async (req: AuthRequest, res, next) => {
    try {
        const professionals = await prisma.professional.findMany({
            where: {
                verification: {
                    status: 'PENDING',
                },
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                    },
                },
                verification: true,
            },
        });

        res.json({ professionals });
    } catch (error) {
        next(error);
    }
});

// Aprobar/Rechazar verificación de profesional
router.patch(
    '/professionals/:id/verify',
    validate([
        body('approved').isBoolean(),
        body('rejectionReason').optional().isString(),
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const { approved, rejectionReason } = req.body;

            const professional = await prisma.professional.findUnique({
                where: { id: req.params.id },
                include: { verification: true },
            });

            if (!professional) {
                throw new AppError('Profesional no encontrado', 404);
            }

            if (!professional.verification) {
                throw new AppError('No hay verificación pendiente', 400);
            }

            // Actualizar verificación
            const verification = await prisma.verification.update({
                where: { id: professional.verification.id },
                data: {
                    status: approved ? 'APPROVED' : 'REJECTED',
                    rejectionReason: approved ? null : rejectionReason,
                    verifiedBy: req.userId,
                    verifiedAt: new Date(),
                },
            });

            // Si se aprobó, marcar usuario como verificado
            if (approved) {
                await prisma.user.update({
                    where: { id: professional.userId },
                    data: { isVerified: true },
                });
            }

            res.json(verification);
        } catch (error) {
            next(error);
        }
    }
);

// Obtener todas las solicitudes de servicio
router.get('/service-requests', async (req: AuthRequest, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const [serviceRequests, total] = await Promise.all([
            prisma.serviceRequest.findMany({
                include: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    professional: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    payment: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit as string),
            }),
            prisma.serviceRequest.count(),
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
});

// Analíticas básicas
router.get('/analytics', async (req: AuthRequest, res, next) => {
    try {
        const [
            totalUsers,
            totalClients,
            totalProfessionals,
            totalServiceRequests,
            completedServices,
            totalRevenue,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'CLIENT' } }),
            prisma.user.count({ where: { role: 'PROFESSIONAL' } }),
            prisma.serviceRequest.count(),
            prisma.serviceRequest.count({ where: { status: 'PAID' } }),
            prisma.payment.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { platformCommission: true },
            }),
        ]);

        res.json({
            totalUsers,
            totalClients,
            totalProfessionals,
            totalServiceRequests,
            completedServices,
            totalRevenue: totalRevenue._sum.platformCommission || 0,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
