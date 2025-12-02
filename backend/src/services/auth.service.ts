import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../index';
import { UserRole } from '@prisma/client';
import { AppError } from '../middleware/error-handler.middleware';

interface RegisterData {
    email: string;
    phone?: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

interface LoginData {
    email: string;
    password: string;
}

export class AuthService {
    // Registrar nuevo usuario
    static async register(data: RegisterData) {
        // Verificar si el email ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new AppError('El email ya está registrado', 409);
        }

        // Verificar si el teléfono ya existe (si se proporcionó)
        if (data.phone) {
            const existingPhone = await prisma.user.findUnique({
                where: { phone: data.phone },
            });

            if (existingPhone) {
                throw new AppError('El teléfono ya está registrado', 409);
            }
        }

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(data.password, 10);

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                email: data.email,
                phone: data.phone,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
            },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                role: true,
                profilePhoto: true,
                isVerified: true,
                createdAt: true,
            },
        });

        // Generar OTP (en un sistema real, enviar por SMS/Email)
        // Por ahora retornamos un código de prueba
        const otpCode = this.generateOTP();

        // En producción: enviar OTP por Twilio o similar
        // await this.sendOTP(user.phone || user.email, otpCode);

        return {
            user,
            otpCode, // Solo para desarrollo, NO enviar en producción
            message: 'Usuario registrado. Verifica tu código OTP.',
        };
    }

    // Login
    static async login(data: LoginData) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: {
                professional: true,
            },
        });

        if (!user) {
            throw new AppError('Credenciales inválidas', 401);
        }

        if (!user.isActive) {
            throw new AppError('Usuario inactivo', 403);
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);

        if (!isValidPassword) {
            throw new AppError('Credenciales inválidas', 401);
        }

        // Generar tokens
        const accessToken = this.generateAccessToken(user.id, user.role);
        const refreshToken = this.generateRefreshToken(user.id, user.role);

        // Remover datos sensibles
        const { passwordHash, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }

    // Verificar OTP
    static async verifyOTP(userId: string, code: string) {
        // En un sistema real, verificar el código desde Redis o DB
        // Por ahora aceptamos cualquier código de 6 dígitos
        if (!/^\d{6}$/.test(code)) {
            throw new AppError('Código OTP inválido', 400);
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isVerified: true,
            },
        });

        const accessToken = this.generateAccessToken(user.id, user.role);
        const refreshToken = this.generateRefreshToken(user.id, user.role);

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    // Refrescar token
    static async refreshAccessToken(refreshToken: string) {
        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET as string
            ) as { userId: string; role: string };

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user || !user.isActive) {
                throw new AppError('Usuario no encontrado', 404);
            }

            const newAccessToken = this.generateAccessToken(user.id, user.role);

            return {
                accessToken: newAccessToken,
            };
        } catch (error) {
            throw new AppError('Refresh token inválido', 401);
        }
    }

    // Generar access token
    private static generateAccessToken(userId: string, role: string): string {
        const options: SignOptions = {
            expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any
        };
        return jwt.sign(
            { userId, role },
            process.env.JWT_SECRET as string,
            options
        );
    }

    // Generar refresh token
    private static generateRefreshToken(userId: string, role: string): string {
        const options: SignOptions = {
            expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any
        };
        return jwt.sign(
            { userId, role },
            process.env.JWT_REFRESH_SECRET as string,
            options
        );
    }

    // Generar código OTP
    private static generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Enviar OTP (integración con Twilio en producción)
    private static async sendOTP(destination: string, code: string) {
        // Implementar con Twilio o servicio de SMS
        console.log(`OTP para ${destination}: ${code}`);
    }
}
