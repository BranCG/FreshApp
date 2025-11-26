import { prisma } from '../index';
import { AppError } from '../middleware/error-handler.middleware';
import { PaymentStatus } from '@prisma/client';

// ⚠️ TEMPORARY: MercadoPago integration disabled due to TypeScript compatibility issues
// TODO: Re-enable when SDK types are fixed or downgrade to v1

interface ProcessPaymentData {
    serviceRequestId: string;
    amount: number;
    paymentMethodId: string;
    clientId: string;
}

export class PaymentService {
    /**
     * Procesar pago con MercadoPago (TEMPORALMENTE DESHABILITADO)
     */
    static async processPayment(data: ProcessPaymentData) {
        const { serviceRequestId, amount, clientId } = data;

        // Verificar que el servicio existe y está completado
        const serviceRequest = await prisma.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            include: {
                professional: true,
                client: true,
            },
        });

        if (!serviceRequest) {
            throw new AppError('Solicitud de servicio no encontrada', 404);
        }

        if (serviceRequest.status !== 'COMPLETED') {
            throw new AppError('El servicio debe estar completado para procesar el pago', 400);
        }

        if (serviceRequest.clientId !== clientId) {
            throw new AppError('No autorizado', 403);
        }

        // Calcular comisión de la plataforma
        const commissionPercentage =
            parseFloat(process.env.PLATFORM_COMMISSION_PERCENTAGE || '10') / 100;
        const platformCommission = amount * commissionPercentage;
        const professionalAmount = amount - platformCommission;

        // Crear registro de pago (sin procesar realmente con MercadoPago)
        const payment = await prisma.payment.create({
            data: {
                serviceRequestId,
                amount,
                platformCommission,
                professionalAmount,
                paymentMethod: 'mercadopago',
                status: PaymentStatus.COMPLETED, // Mock: simular pago exitoso
                transactionId: `MOCK-${Date.now()}`,
                paidAt: new Date(),
            },
        });

        // Actualizar estado del servicio
        await prisma.serviceRequest.update({
            where: { id: serviceRequestId },
            data: { status: 'PAID' },
        });

        return payment;
    }

    /**
     * Obtener historial de pagos
     */
    static async getPaymentHistory(userId: string, role: string) {
        if (role === 'CLIENT') {
            return await prisma.payment.findMany({
                where: {
                    serviceRequest: {
                        clientId: userId,
                    },
                },
                include: {
                    serviceRequest: {
                        include: {
                            professional: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    profilePhoto: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        } else if (role === 'PROFESSIONAL') {
            return await prisma.payment.findMany({
                where: {
                    serviceRequest: {
                        professionalId: userId,
                    },
                    status: PaymentStatus.COMPLETED,
                },
                include: {
                    serviceRequest: {
                        include: {
                            client: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    profilePhoto: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }

        return [];
    }

    /**
     * Obtener ganancias del profesional
     */
    static async getProfessionalEarnings(professionalId: string) {
        const payments = await prisma.payment.findMany({
            where: {
                serviceRequest: {
                    professionalId,
                },
                status: PaymentStatus.COMPLETED,
            },
            select: {
                professionalAmount: true,
                paidAt: true,
            },
        });

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const earnings = {
            today: 0,
            week: 0,
            month: 0,
            total: 0,
            count: payments.length,
        };

        payments.forEach((payment) => {
            const amount = parseFloat(payment.professionalAmount.toString());
            earnings.total += amount;

            if (payment.paidAt) {
                if (payment.paidAt >= todayStart) {
                    earnings.today += amount;
                }
                if (payment.paidAt >= weekStart) {
                    earnings.week += amount;
                }
                if (payment.paidAt >= monthStart) {
                    earnings.month += amount;
                }
            }
        });

        return earnings;
    }
}
