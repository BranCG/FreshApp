import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AWS from 'aws-sdk';
import { AppError } from '../middleware/error-handler.middleware';

// Configurar AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Configuración de multer para memoria (antes de subir a S3)
const storage = multer.memoryStorage();

// Filtro de archivos
const fileFilter = (
    req: any,
    file: any,
    cb: multer.FileFilterCallback
) => {
    // Validar tipo de archivo
    const allowedTypes = process.env.ALLOWED_IMAGE_TYPES?.split(',') || [
        'image/jpeg',
        'image/png',
        'image/jpg',
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Tipo de archivo no permitido', 400));
    }
};

// Middleware de multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024), // MB a bytes
    },
});

// Upload a S3
export const uploadToS3 = async (
    file: any,
    folder: string = 'uploads'
): Promise<string> => {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    // En desarrollo, si no hay credenciales de AWS, guardar localmente
    if (process.env.NODE_ENV === 'development' && (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)) {
        console.log('⚠️  AWS credentials not configured, using Local Storage');

        try {
            const uploadDir = path.join(__dirname, '../../uploads', folder);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const safeFileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const filePath = path.join(uploadDir, safeFileName);

            fs.writeFileSync(filePath, file.buffer);

            // Retornan ruta relativa para que el frontend la complete con su API_URL
            return `/uploads/${folder}/${safeFileName}`;
        } catch (err) {
            console.error('Local upload failed:', err);
            return `https://via.placeholder.com/400x400.png?text=Error+Upload`;
        }
    }

    const params: AWS.S3.PutObjectRequest = {
        Bucket: process.env.AWS_S3_BUCKET || 'freshapp-uploads',
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };

    try {
        const result = await s3.upload(params).promise();
        return result.Location;
    } catch (error: any) {
        // En desarrollo, si falla la subida a S3, usar URL mock
        if (process.env.NODE_ENV === 'development') {
            console.log('⚠️  S3 upload failed in development, using mock URL');
            return `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(file.originalname)}`;
        }
        throw new AppError('Error al subir archivo a S3', 500, error.message);
    }
};

// Eliminar de S3
export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
    try {
        const url = new URL(fileUrl);
        const key = url.pathname.substring(1); // Remover el primer /

        const params: AWS.S3.DeleteObjectRequest = {
            Bucket: process.env.AWS_S3_BUCKET || 'freshapp-uploads',
            Key: key,
        };

        await s3.deleteObject(params).promise();
    } catch (error: any) {
        throw new AppError('Error al eliminar archivo de S3', 500, error.message);
    }
};

// Validar que el archivo sea una imagen
export const isImage = (mimetype: string): boolean => {
    return ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(mimetype);
};

// Validar que el archivo sea un documento
export const isDocument = (mimetype: string): boolean => {
    return [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
    ].includes(mimetype);
};
