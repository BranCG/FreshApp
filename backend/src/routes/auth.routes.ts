import { Router } from 'express';
import { body } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { validate } from '../middleware/validation.middleware';
import { authRateLimiter } from '../middleware/rate-limiter.middleware';

const router = Router();

// Registro de usuario
router.post(
    '/register',
    authRateLimiter,
    validate([
        body('email').isEmail().withMessage('Email inválido'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('La contraseña debe tener al menos 8 caracteres'),
        body('firstName').notEmpty().withMessage('El nombre es requerido'),
        body('lastName').notEmpty().withMessage('El apellido es requerido'),
        body('role')
            .isIn(['CLIENT', 'PROFESSIONAL'])
            .withMessage('Rol inválido'),
        body('phone').optional().isMobilePhone('any'),
    ]),
    async (req, res, next) => {
        try {
            const result = await AuthService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
);

// Login
router.post(
    '/login',
    authRateLimiter,
    validate([
        body('email').isEmail().withMessage('Email inválido'),
        body('password').notEmpty().withMessage('La contraseña es requerida'),
    ]),
    async (req, res, next) => {
        try {
            const result = await AuthService.login(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

// Verificar OTP
router.post(
    '/verify-otp',
    validate([
        body('userId').isUUID().withMessage('User ID inválido'),
        body('code')
            .isLength({ min: 6, max: 6 })
            .withMessage('Código OTP debe tener 6 dígitos'),
    ]),
    async (req, res, next) => {
        try {
            const { userId, code } = req.body;
            const result = await AuthService.verifyOTP(userId, code);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

// Refrescar token
router.post(
    '/refresh-token',
    validate([
        body('refreshToken').notEmpty().withMessage('Refresh token requerido'),
    ]),
    async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const result = await AuthService.refreshAccessToken(refreshToken);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

// Recuperar contraseña (TO-DO: implementar)
router.post(
    '/forgot-password',
    validate([body('email').isEmail().withMessage('Email inválido')]),
    async (req, res, next) => {
        try {
            // TO-DO: Implementar lógica de recuperación
            res.json({
                message: 'Se ha enviado un correo con instrucciones',
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
