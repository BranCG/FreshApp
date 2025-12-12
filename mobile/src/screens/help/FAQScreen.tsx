import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Divider, IconButton, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

interface FAQItem {
    question: string;
    answer: string;
    category: 'safety' | 'service' | 'payments' | 'penalties';
}

export const FAQScreen: React.FC<any> = ({ navigation }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        // SEGURIDAD
        {
            category: 'safety',
            question: '¿Cómo garantiza FreshApp mi seguridad?',
            answer: 'Implementamos múltiples capas de seguridad:\n• Verificación básica de identidad de profesionales\n• Sistema de calificaciones y reseñas\n• Monitoreo de actividad sospechosa 24/7\n• Respuesta inmediata ante reportes\n• Colaboración con autoridades\n• Cierre inmediato de cuentas ante riesgos'
        },
        {
            category: 'safety',
            question: '¿Qué hago si me siento inseguro durante un servicio?',
            answer: 'PRIORIDAD #1: Tu seguridad.\n1. Detén el servicio inmediatamente\n2. Llama a emergencias (133/Carabineros) si es necesario\n3. Reporta en la app: "Perfil → Reportar Incidente"\n4. Guarda evidencias (mensajes, fotos, etc.)\n5. FreshApp colaborará en investigación y proceso legal'
        },
        {
            category: 'safety',
            question: '¿Puedo compartir mi contacto con el profesional/cliente?',
            answer: 'Sí, PERO con condiciones:\n• DEBES completar y reportar el servicio actual en la app PRIMERO\n• Compartir contacto ANTES es violación de términos\n• Penalizaciones: advertencia → suspensión → bloqueo\n• Esto protege a ambas partes y mantiene registro del servicio'
        },
        {
            category: 'safety',
            question: '¿FreshApp verifica la identidad de los profesionales?',
            answer: 'Sí, realizamos verificación básica:\n• Validación de correo electrónico\n• Número de teléfono verificado\n• Foto de perfil real requerida\n• Sistema de calificaciones transparente\n\nSin embargo, CADA USUARIO debe ejercer su propio juicio. Revisa calificaciones y confía en tu instinto.'
        },

        // SERVICIOS
        {
            category: 'service',
            question: '¿El profesional debe tener mi consentimiento para entrar?',
            answer: 'ABSOLUTAMENTE SÍ.\n\nProfesional DEBE:\n✓ Solicitar consentimiento EXPLÍCITO antes de entrar\n✓ Respetar espacios privados\n✓ Solo ingresar a áreas necesarias para el servicio\n\nCliente DEBE:\n✓ Dar consentimiento claro\n✓ Preparar espacio adecuado y limpio\n✓ Asegurar seguridad del profesional\n\nFalta de consentimiento = VIOLACIÓN GRAVE'
        },
        {
            category: 'service',
            question: '¿Qué pasa si el espacio no es adecuado para el servicio?',
            answer: 'El profesional PUEDE:\n• Solicitar mejores condiciones\n• Reprogramar el servicio\n• Cancelar si el ambiente es inseguro\n\nEl cliente DEBE:\n• Proveer espacio limpio y seguro\n• Tener herramientas básicas si se requieren\n• Asegurar iluminación adecuada\n\nAmbos pueden cancelar si las condiciones no son óptimas.'
        },
        {
            category: 'service',
            question: '¿Cómo reporto que completé un servicio?',
            answer: 'IMPORTANTE: Reportar servicios es OBLIGATORIO.\n\n1. Ve a "Historial"\n2. Selecciona el servicio completado\n3. Presiona "Marcar como Completado"\n4. Ingresa el pago acordado\n5. (Opcional) Deja una calificación\n\n⚠️ No reportar = penalizaciones por inactividad'
        },

        // PAGOS
        {
            category: 'payments',
            question: '¿Los pagos se procesan por la app?',
            answer: 'Actualmente: NO. Pagos se realizan directamente entre cliente y profesional.\n\nPERO DEBES:\n• Acordar precio antes del servicio\n• REPORTAR el pago en la app después\n• Esto nos ayuda a:\n  - Verificar actividad real\n  - Mantener registro transparente\n  - Detectar fraudes\n\nSistema de pagos integrado: Próximamente'
        },

        // PENALIZACIONES
        {
            category: 'penalties',
            question: '¿Qué pasa si no reporto servicios completados?',
            answer: 'Penalizaciones progresivas:\n\n1ª vez: Advertencia formal\n2ª vez: Suspensión 7 días\n3ª vez: Suspensión 30 días\nReincidencia: Bloqueo permanente\n\n¿Por qué? Para:\n• Evitar evasión de la plataforma\n• Mantener actividad transparente\n• Proteger a la comunidad'
        },
        {
            category: 'penalties',
            question: '¿Qué es una "violación grave de seguridad"?',
            answer: 'Incluye (pero no se limita a):\n\n⛔ Acoso o intimidación\n⛔ Comportamiento inapropiado\n⛔ Ingreso sin consentimiento\n⛔ Robo o daño a propiedad\n⛔ Violencia física o verbal\n⛔ Fraude o estafa\n\nCONSECUENCIA:\n• Cierre INMEDIATO de cuenta\n• Prohibición PERMANENTE\n• Reporte a AUTORIDADES\n• Apoyo legal a la víctima'
        },
        {
            category: 'penalties',
            question: '¿Puedo apelar una suspensión?',
            answer: 'Sí, puedes apelar:\n\n1. Envía email a: apelaciones@freshapp.com\n2. Incluye:\n   • Tu ID de usuario\n   • Razón de suspensión\n   • Evidencia que respalde tu caso\n3. Revisión en 3-5 días hábiles\n\nNOTA: Suspensiones por seguridad son FINALES y NO se reversan.'
        },

        // APOYO LEGAL
        {
            category: 'safety',
            question: '¿FreshApp me apoyará en un proceso legal?',
            answer: 'SÍ, ABSOLUTAMENTE.\n\nNos comprometemos a:\n✅ Proveer TODA la información disponible\n✅ Preservar evidencia digital\n✅ Colaborar con investigaciones\n✅ Testificar si es necesario\n✅ Apoyar a la víctima en todo el proceso\n\nTu seguridad es nuestra responsabilidad compartida.'
        },
    ];

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'safety': return '🛡️';
            case 'service': return '💼';
            case 'payments': return '💳';
            case 'penalties': return '⚖️';
            default: return '❓';
        }
    };

    const toggleFAQ = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Preguntas Frecuentes</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.introBox}>
                    <Text style={styles.introText}>
                        Encuentra respuestas rápidas sobre seguridad, servicios, pagos y políticas de FreshApp.
                    </Text>
                </View>

                {faqs.map((faq, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => toggleFAQ(index)}
                        activeOpacity={0.7}
                    >
                        <Card style={styles.faqCard}>
                            <View style={styles.questionContainer}>
                                <Text style={styles.categoryIcon}>
                                    {getCategoryIcon(faq.category)}
                                </Text>
                                <Text style={styles.question}>{faq.question}</Text>
                                <IconButton
                                    icon={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    iconColor={theme.colors.primary}
                                />
                            </View>

                            {expandedIndex === index && (
                                <>
                                    <Divider style={styles.faqDivider} />
                                    <View style={styles.answerContainer}>
                                        <Text style={styles.answer}>{faq.answer}</Text>
                                    </View>
                                </>
                            )}
                        </Card>
                    </TouchableOpacity>
                ))}

                <View style={styles.footerBox}>
                    <Text style={styles.footerTitle}>¿No encontraste tu respuesta?</Text>
                    <Text style={styles.footerText}>
                        Contáctanos en:{'\n'}
                        <Text style={styles.footerEmail}>soporte@freshapp.com</Text>
                        {'\n\n'}
                        Tiempo de respuesta: 24-48 horas
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.white,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    introBox: {
        backgroundColor: theme.colors.primary + '15',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    introText: {
        fontSize: 14,
        color: theme.colors.primary,
        lineHeight: 20,
        textAlign: 'center',
    },
    faqCard: {
        marginBottom: 12,
        backgroundColor: theme.colors.white,
        elevation: 2,
    },
    questionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    categoryIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    question: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text,
        lineHeight: 22,
    },
    faqDivider: {
        marginHorizontal: 16,
    },
    answerContainer: {
        padding: 16,
        paddingTop: 12,
        backgroundColor: theme.colors.grey50,
    },
    answer: {
        fontSize: 14,
        color: theme.colors.text,
        lineHeight: 22,
    },
    footerBox: {
        backgroundColor: theme.colors.grey100,
        padding: 20,
        borderRadius: 12,
        marginTop: 24,
        alignItems: 'center',
    },
    footerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 12,
    },
    footerText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    footerEmail: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
});
