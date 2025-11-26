import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { NotificationService } from '../services/notification.service';

const router = Router();

// Obtener notificaciones del usuario
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const result = await NotificationService.getUserNotifications(
            req.userId!,
            parseInt(page as string),
            parseInt(limit as string)
        );

        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Marcar notificación como leída
router.patch('/:id/read', authenticate, async (req: AuthRequest, res, next) => {
    try {
        await NotificationService.markAsRead(req.params.id, req.userId!);
        res.json({ message: 'Notificación marcada como leída' });
    } catch (error) {
        next(error);
    }
});

// Marcar todas como leídas
router.patch('/read-all', authenticate, async (req: AuthRequest, res, next) => {
    try {
        await NotificationService.markAllAsRead(req.userId!);
        res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        next(error);
    }
});

// Registrar token de dispositivo
router.post(
    '/register-device',
    authenticate,
    validate([
        body('deviceToken').notEmpty(),
        body('platform').isIn(['ios', 'android']),
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const { deviceToken, platform } = req.body;

            await NotificationService.registerDeviceToken(
                req.userId!,
                deviceToken,
                platform
            );

            res.json({ message: 'Token registrado exitosamente' });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
