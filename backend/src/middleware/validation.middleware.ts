import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Ejecutar todas las validaciones
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            error: 'Error de validación',
            details: errors.array().map((err) => ({
                field: err.type === 'field' ? err.path : undefined,
                message: err.msg,
            })),
        });
    };
};
