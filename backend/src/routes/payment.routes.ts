import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, AuthRequest, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { PaymentService } from '../services/payment.service';

const router = Router();

// Procesar pago
router.post(
    '/process',
    authenticate,
    authorize('CLIENT'),
    validate([
        body('serviceRequestId').isUUID(),
        body('paymentMethodId').notEmpty(),
        body('amount').isFloat({ min: 0 }),
    ]),
    async (req: AuthRequest, res, next) => {
        try {
            const { serviceRequestId, paymentMethodId, amount } = req.body;

            const payment = await PaymentService.processPayment({
                serviceRequestId,
                paymentMethodId,
                amount,
                clientId: req.userId!,
            });

            res.json(payment);
        } catch (error) {
            next(error);
        }
    }
);

// Obtener historial de pagos
router.get('/history', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const history = await PaymentService.getPaymentHistory(
            req.userId!,
            req.userRole!
        );

        res.json({ payments: history });
    } catch (error) {
        next(error);
    }
});

// Obtener ganancias (profesional)
router.get(
    '/earnings',
    authenticate,
    authorize('PROFESSIONAL'),
    async (req: AuthRequest, res, next) => {
        try {
            const earnings = await PaymentService.getProfessionalEarnings(req.userId!);

            res.json(earnings);
        } catch (error) {
            next(error);
        }
    }
);

// Agregar método de pago (TO-DO: implementar con MercadoPago SDK)
router.post(
    '/methods',
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            // TO-DO: Integrar con MercadoPago tokenización de tarjetas
            res.json({
                message: 'Método de pago agregado (placeholder)',
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
