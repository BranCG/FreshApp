import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userRole?: string;
            file?: Express.Multer.File;
            files?: Express.Multer.File[];
        }
    }
}

export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}
