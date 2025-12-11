import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../index';
import { upload, uploadToS3 } from '../services/file-upload.service';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Obtener perfil del usuario autenticado
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                profilePhoto: true,
                role: true,
                isVerified: true,
                address: true,
                latitude: true,
                longitude: true,
                createdAt: true,
                professional: {
                    include: {
                        verification: true,
                        portfolioItems: {
                            orderBy: { displayOrder: 'asc' },
                        },
                    },
                },
            },
        });

        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Actualizar perfil
router.put(
    '/me',
    authenticate,
    validate([
        body('firstName').optional().notEmpty(),
        body('lastName').optional().notEmpty(),
        body('phone').optional().isMobilePhone('any'),
        body('address').optional().isString(),
        body('latitude').optional().isFloat(),
        body('longitude').optional().isFloat(),
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const { firstName, lastName, phone, address, latitude, longitude } = req.body;

            const user = await prisma.user.update({
                where: { id: req.userId },
                data: {
                    firstName,
                    lastName,
                    phone,
                    address,
                    latitude,
                    longitude,
                },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    firstName: true,
                    lastName: true,
                    profilePhoto: true,
                    role: true,
                    address: true,
                    latitude: true,
                    longitude: true,
                },
            });

            res.json(user);
        } catch (error) {
            next(error);
        }
    }
);

// Subir/Actualizar foto de perfil
router.put(
    '/me/photo',
    authenticate,
    upload.single('photo'),
    async (req: AuthRequest, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No se proporcionó archivo' });
            }

            // Subir a S3
            const photoUrl = await uploadToS3(req.file, 'profile-photos');

            // Actualizar usuario
            const user = await prisma.user.update({
                where: { id: req.userId },
                data: { profilePhoto: photoUrl },
                select: {
                    id: true,
                    profilePhoto: true,
                },
            });

            res.json(user);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
