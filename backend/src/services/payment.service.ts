import mercadopago from 'mercadopago';
import { prisma } from '../index';
import { AppError } from '../middleware/error-handler.middleware';
import { PaymentStatus } from '@prisma/client';

// Configurar MercadoPago
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

interface ProcessPaymentData {
    serviceRequestId: string;
    amount: number;
    paymentMethodId: string;
    clientId: string;
}

export class PaymentService {
    /**
     * Procesar pago con MercadoPago
     */
    static async processPayment(data: ProcessPaymentData) {
        const { serviceRequestId, amount, paymentMethodId, clientId } = data;

        // Verificar que el servicio existe y está completado
        const serviceRequest = await prisma.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            include: {
                professional: {
                    include: {
                        user: true,
                    },
                },
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

        // Crear registro de pago
        const payment = await prisma.payment.create({
            data: {
                serviceRequestId,
                amount,
                platformCommission,
                professionalAmount,
                paymentMethod: 'mercadopago',
                status: PaymentStatus.PROCESSING,
            },
        });

        try {
            // Procesar pago con MercadoPago
            const mercadopagoPayment = await mercadopago.payment.create({
                transaction_amount: amount,
                description: `Pago por servicio ${serviceRequest.category}`,
                payment_method_id: paymentMethodId,
                payer: {
                    email: serviceRequest.client.email,
                },
                // Metadata adicional
                metadata: {
                    service_request_id: serviceRequestId,
                    platform_commission: platformCommission,
                    professional_amount: professionalAmount,
                },
            });

            // Actualizar pago con información de MercadoPago
            const updatedPayment = await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    transactionId: mercadopagoPayment.body.id?.toString(),
                    status:
                        mercadopagoPayment.body.status === 'approved'
                            ? PaymentStatus.COMPLETED
                            : PaymentStatus.FAILED,
                    paidAt:
                        mercadopagoPayment.body.status === 'approved' ? new Date() : null,
                    errorMessage:
                        mercadopagoPayment.body.status !== 'approved'
                            ? mercadopagoPayment.body.status_detail
                            : null,
                },
            });

            // Si el pago fue exitoso, actualizar el estado del servicio
            if (updatedPayment.status === PaymentStatus.COMPLETED) {
                await prisma.serviceRequest.update({
                    where: { id: serviceRequestId },
                    data: { status: 'PAID' },
                });
            }

            return updatedPayment;
        } catch (error: any) {
            // Actualizar pago como fallido
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: PaymentStatus.FAILED,
                    errorMessage: error.message,
                },
            });

            throw new AppError('Error al procesar el pago', 500, error.message);
        }
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
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            profilePhoto: true,
                                        },
                                    },
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
