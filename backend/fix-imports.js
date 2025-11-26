// Script para agregar imports faltantes
import * as fs from 'fs';
import * as path from 'path';

const files = [
    {
        path: 'src/services/file-upload.service.ts',
        fixes: [
            { search: "import multer from 'multer';", replace: "import multer from 'multer';\nimport { S3Client } from '@aws-sdk/client-s3';" }
        ]
    },
    {
        path: 'src/services/geolocation.service.ts',
        fixes: [
            { search: "import { prisma } from '../index';", replace: "import { prisma } from '../index';\nimport { Prisma } from '@prisma/client';" }
        ]
    },
    {
        path: 'src/services/notification.service.ts',
        fixes: [
            { search: "import { NotificationType } from '@prisma/client';", replace: "import { NotificationType, Notification } from '@prisma/client';" }
        ]
    }
];

files.forEach(file => {
    const filePath = path.join(process.cwd(), file.path);
    let content = fs.readFileSync(filePath, 'utf8');

    file.fixes.forEach(fix => {
        content = content.replace(fix.search, fix.replace);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file.path}`);
});

console.log('✅ All imports fixed!');
