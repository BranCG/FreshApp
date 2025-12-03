import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import professionalRoutes from './routes/professional.routes';
import serviceRequestRoutes from './routes/service-request.routes';
import paymentRoutes from './routes/payment.routes';
import reviewRoutes from './routes/review.routes';
import chatRoutes from './routes/chat.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';

// Importar middleware
import { errorHandler } from './middleware/error-handler.middleware';
import { rateLimiter } from './middleware/rate-limiter.middleware';

// Importar socket handlers
import { initializeSocketHandlers } from './sockets/chat.socket';

// Inicializar Prisma
export const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Crear aplicación Express
const app = express();
const httpServer = createServer(app);

// Configurar Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:19006',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Hacer io accesible en las rutas
app.set('io', io);

// Middleware de seguridad y utilidades
app.use(helmet());
app.use(cors({
    origin: '*', // Allow all origins for debugging
    credentials: true,
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', rateLimiter);

// Health check
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        path: req.originalUrl,
    });
});

// Error handler (debe ser el último middleware)
app.use(errorHandler);

// Inicializar Socket.io handlers
initializeSocketHandlers(io);

// Puerto
const PORT = parseInt(process.env.PORT || '3000', 10);

// Iniciar servidor
async function startServer() {
    try {
        // Verificar conexión a la base de datos
        await prisma.$connect();
        console.log('✅ Conectado a PostgreSQL');

        // Iniciar servidor HTTP
        httpServer.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📍 API URL: http://localhost:${PORT}/api`);
            console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
    console.log('SIGTERM recibido, cerrando servidor...');
    await prisma.$disconnect();
    httpServer.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT recibido, cerrando servidor...');
    await prisma.$disconnect();
    httpServer.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

// Iniciar
startServer();

export { io };
