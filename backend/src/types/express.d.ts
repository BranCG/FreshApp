import { Request } from 'express';
import * as multer from 'multer';

declare global {
    namespace Express {
        export interface Request {
            userId?: string;
            userRole?: string;
            file?: multer.File;
            files?: multer.File[] | { [fieldname: string]: multer.File[] };
        }
    }
}

export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}
