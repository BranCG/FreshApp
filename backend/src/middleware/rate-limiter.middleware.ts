import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos
    message: {
        error: 'Demasiados intentos de autenticación, intenta de nuevo más tarde',
    },
    skipSuccessfulRequests: true,
});
