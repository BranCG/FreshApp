import { Router } from 'express';
import { body, query } from 'express-validator';
import { authenticate, AuthRequest, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { prisma } from '../index';
import { GeolocationService } from '../services/geolocation.service';
import { upload, uploadToS3 } from '../services/file-upload.service';
import { AppError } from '../middleware/error-handler.middleware';

const router = Router();

// Buscar profesionales cercanos
router.get(
    '/nearby',
    authenticate,
    validate([
        query('latitude').isFloat().withMessage('Latitud inválida'),
        query('longitude').isFloat().withMessage('Longitud inválida'),
        query('radius').optional().isInt({ min: 100 }).withMessage('Radio mínimo 100m'),
        query('category').optional().isIn(['BARBER', 'TATTOO_ARTIST', 'MANICURIST']),
        query('minRating').optional().isFloat({ min: 0, max: 5 }),
        query('maxPrice').optional().isFloat({ min: 0 }),
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const {
                latitude,
                longitude,
                radius = 5000,
                category,
                minRating,
                maxPrice,
            } = req.query;

            const professionals = await GeolocationService.findNearbyProfessionals({
                latitude: parseFloat(latitude as string),
                longitude: parseFloat(longitude as string),
                radius: parseInt(radius as string),
                category: category as string,
                minRating: minRating ? parseFloat(minRating as string) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
            });

            res.json({ professionals });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener detalles de un profesional
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const professional = await prisma.professional.findUnique({
            where: { id: req.params.id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        createdAt: true,
                    },
                },
                portfolioItems: {
                    orderBy: { displayOrder: 'asc' },
                },
            },
        });

        if (!professional) {
            return res.status(404).json({ error: 'Profesional no encontrado' });
        }

        res.json(professional);
    } catch (error) {
        next(error);
    }
});

// Crear perfil profesional
router.post(
    '/profile',
    authenticate,
    authorize('PROFESSIONAL'),
    validate([
        body('category').isIn(['BARBER', 'TATTOO_ARTIST', 'MANICURIST']),
        body('bio').optional().isString(),
        body('prices').isObject(),
        body('hashtags').optional().isArray(),
        body('address').notEmpty(),
        body('latitude').isFloat(),
        body('longitude').isFloat(),
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const {
                category,
                bio,
                prices,
                hashtags,
                address,
                latitude,
                longitude,
                isAvailable = true, // Default to true if provided or default
            } = req.body;

            // Verificar si ya tiene perfil profesional
            const existing = await prisma.professional.findUnique({
                where: { userId: req.userId },
            });

            if (existing) {
                throw new AppError('Ya tienes un perfil profesional', 409);
            }

            const professional = await prisma.professional.create({
                data: {
                    userId: req.userId!,
                    category,
                    bio,
                    prices,
                    hashtags,
                    address,
                    latitude,
                    longitude,
                    isAvailable,
                },
            });

            res.status(201).json(professional);
        } catch (error) {
            next(error);
        }
    }
);

// Actualizar perfil profesional
router.put(
    '/me',
    authenticate,
    authorize('PROFESSIONAL'),
    async (req: AuthRequest, res, next) => {
        try {
            const { bio, prices, hashtags, address, latitude, longitude, isAvailable } =
                req.body;

            const professional = await prisma.professional.update({
                where: { userId: req.userId },
                data: {
                    bio,
                    prices,
                    hashtags,
                    address,
                    latitude,
                    longitude,
                    isAvailable,
                },
            });

            res.json(professional);
        } catch (error) {
            next(error);
        }
    }
);

// Toggle disponibilidad
router.patch(
    '/me/availability',
    authenticate,
    authorize('PROFESSIONAL'),
    async (req: AuthRequest, res, next) => {
        try {
            const { isAvailable } = req.body;

            const professional = await prisma.professional.update({
                where: { userId: req.userId },
                data: { isAvailable },
            });

            res.json({ isAvailable: professional.isAvailable });
        } catch (error) {
            next(error);
        }
    }
);

// Agregar item al portafolio
router.post(
    '/me/portfolio',
    authenticate,
    authorize('PROFESSIONAL'),
    upload.single('image'),
    async (req: AuthRequest, res, next) => {
        try {
            if (!req.file) {
                throw new AppError('Se requiere una imagen', 400);
            }

            // Subir a S3
            const imageUrl = await uploadToS3(req.file, 'portfolio');

            // Obtener el profesional
            const professional = await prisma.professional.findUnique({
                where: { userId: req.userId },
            });

            if (!professional) {
                throw new AppError('Perfil profesional no encontrado', 404);
            }

            // Crear item de portafolio
            const portfolioItem = await prisma.portfolioItem.create({
                data: {
                    professionalId: professional.id,
                    imageUrl,
                    description: req.body.description,
                    displayOrder: parseInt(req.body.displayOrder || '0'),
                },
            });

            res.status(201).json(portfolioItem);
        } catch (error) {
            next(error);
        }
    }
);

// Eliminar item del portafolio
router.delete(
    '/me/portfolio/:itemId',
    authenticate,
    authorize('PROFESSIONAL'),
    async (req: AuthRequest, res, next) => {
        try {
            const professional = await prisma.professional.findUnique({
                where: { userId: req.userId },
            });

            if (!professional) {
                throw new AppError('Perfil profesional no encontrado', 404);
            }

            await prisma.portfolioItem.deleteMany({
                where: {
                    id: req.params.itemId,
                    professionalId: professional.id,
                },
            });

            res.json({ message: 'Item eliminado' });
        } catch (error) {
            next(error);
        }
    }
);

// Subir documentos de verificación
router.post(
    '/me/verification',
    authenticate,
    authorize('PROFESSIONAL'),
    upload.fields([
        { name: 'idDocument', maxCount: 1 },
        { name: 'backgroundCheck', maxCount: 1 },
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const files = req.files as any;

            if (!files.idDocument || !files.backgroundCheck) {
                throw new AppError('Se requieren ambos documentos', 400);
            }

            // Subir documentos a S3
            const idDocumentUrl = await uploadToS3(files.idDocument[0], 'verifications');
            const backgroundCheckUrl = await uploadToS3(
                files.backgroundCheck[0],
                'verifications'
            );

            // Obtener profesional
            const professional = await prisma.professional.findUnique({
                where: { userId: req.userId },
            });

            if (!professional) {
                throw new AppError('Perfil profesional no encontrado', 404);
            }

            // Crear o actualizar verificación
            const verification = await prisma.verification.upsert({
                where: { professionalId: professional.id },
                create: {
                    professionalId: professional.id,
                    idDocumentUrl,
                    backgroundCheckUrl,
                    status: 'PENDING',
                },
                update: {
                    idDocumentUrl,
                    backgroundCheckUrl,
                    status: 'PENDING',
                    rejectionReason: null,
                },
            });

            res.status(201).json(verification);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
