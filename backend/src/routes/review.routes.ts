import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { prisma } from '../index';
import { AppError } from '../middleware/error-handler.middleware';

const router = Router();

// Crear reseña
router.post(
    '/',
    authenticate,
    validate([
        body('serviceRequestId').isUUID(),
        body('professionalId').isUUID(),
        body('rating').isInt({ min: 1, max: 5 }),
        body('comment').optional().isString(),
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const { serviceRequestId, professionalId, rating, comment } = req.body;

            // Verificar que el servicio existe y está completado
            const serviceRequest = await prisma.serviceRequest.findUnique({
                where: { id: serviceRequestId },
            });

            if (!serviceRequest) {
                throw new AppError('Solicitud de servicio no encontrada', 404);
            }

            if (serviceRequest.clientId !== req.userId) {
                throw new AppError('No autorizado', 403);
            }

            if (serviceRequest.status !== 'PAID' && serviceRequest.status !== 'COMPLETED') {
                throw new AppError('El servicio debe estar completado y pagado', 400);
            }

            // Verificar que no exista ya una reseña
            const existingReview = await prisma.review.findUnique({
                where: { serviceRequestId },
            });

            if (existingReview) {
                throw new AppError('Ya has dejado una reseña para este servicio', 409);
            }

            // Crear reseña
            const review = await prisma.review.create({
                data: {
                    serviceRequestId,
                    clientId: req.userId!,
                    professionalId,
                    rating,
                    comment,
                },
            });

            // Actualizar estadísticas del profesional
            const reviews = await prisma.review.findMany({
                where: { professionalId },
                select: { rating: true },
            });

            const avgRating =
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            const totalReviews = reviews.length;

            await prisma.professional.update({
                where: { userId: professionalId },
                data: {
                    avgRating,
                    totalReviews,
                },
            });

            res.status(201).json(review);
        } catch (error) {
            next(error);
        }
    }
);

// Obtener reseñas de un profesional
router.get(
    '/professional/:professionalId',
    authenticate,
    validate([param('professionalId').isUUID()]),
    async (req: AuthRequest, res, next) => {
        try {
            const reviews = await prisma.review.findMany({
                where: { professionalId: req.params.professionalId },
                include: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true,
                            profilePhoto: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            res.json({ reviews });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
