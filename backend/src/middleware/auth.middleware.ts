import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

export type AuthRequest = any;

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'No se proporcionó token de autenticación',
            });
        }

        const token = authHeader.substring(7);

        // Verificar token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { userId: string; role: string };

        // Verificar que el usuario existe y está activo
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true, isActive: true },
        });

        if (!user || !user.isActive) {
            return res.status(401).json({
                error: 'Usuario no encontrado o inactivo',
            });
        }

        // Agregar datos del usuario al request
        req.userId = user.id;
        req.userRole = user.role;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: 'Token inválido',
            });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: 'Token expirado',
            });
        }
        return res.status(500).json({
            error: 'Error en autenticación',
        });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            return res.status(403).json({
                error: 'No tienes permisos para acceder a este recurso',
            });
        }
        next();
    };
};
