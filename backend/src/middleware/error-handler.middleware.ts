import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', err);

    // Error de validación
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Error de validación',
            details: err.details,
        });
    }

    // Error de Prisma
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'Ya existe un registro con estos datos',
            field: err.meta?.target,
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Registro no encontrado',
        });
    }

    // Error de multer (upload)
    if (err.name === 'MulterError') {
        return res.status(400).json({
            error: 'Error al subir archivo',
            details: err.message,
        });
    }

    // Error personalizado
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            error: err.message,
            details: err.details,
        });
    }

    // Error genérico
    return res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
};

export class AppError extends Error {
    statusCode: number;
    details?: any;

    constructor(message: string, statusCode: number = 500, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'AppError';
    }
}
