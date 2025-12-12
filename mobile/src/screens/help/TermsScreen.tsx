import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Divider, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

export const TermsScreen: React.FC<any> = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Términos y Condiciones</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.alertBox}>
                    <Text style={styles.alertText}>
                        ⚠️ SEGURIDAD PRIMERO: La protección de clientes y profesionales es nuestra prioridad absoluta.
                    </Text>
                </View>

                <Text style={styles.updateDate}>Última actualización: Diciembre 2024</Text>

                {/* 1. INTRODUCCIÓN */}
                <Text style={styles.sectionTitle}>1. Introducción</Text>
                <Text style={styles.paragraph}>
                    FreshApp es una plataforma de servicios a domicilio que conecta profesionales con clientes. Al usar nuestros servicios, aceptas estos términos y te comprometes a cumplir con todas las normas de seguridad.
                </Text>

                <Divider style={styles.divider} />

                {/* 2. MARCO LEGAL */}
                <Text style={styles.sectionTitle}>2. Marco Legal y Normativo</Text>
                <Text style={styles.subsectionTitle}>2.1 Leyes Aplicables</Text>
                <Text style={styles.paragraph}>
                    • <Text style={styles.bold}>Ley 19.496 de Protección al Consumidor (Chile)</Text>: Garantiza los derechos de los usuarios.{'\n'}
                    • <Text style={styles.bold}>Ley 19.628 sobre Protección de Datos Personales</Text>{'\n'}
                    • Código Civil y Penal de Chile
                </Text>

                <Text style={styles.subsectionTitle}>2.2 Normas ISO</Text>
                <Text style={styles.paragraph}>
                    • <Text style={styles.bold}>ISO 9001 (Gestión de Calidad)</Text>: Garantizamos calidad en el servicio.{'\n'}
                    • <Text style={styles.bold}>ISO 27001 (Seguridad de la Información)</Text>: Protección de datos personales.{'\n'}
                    • <Text style={styles.bold}>ISO 45001 (Seguridad y Salud)</Text>: Entornos seguros para profesionales.
                </Text>

                <Divider style={styles.divider} />

                {/* 3. SEGURIDAD Y OBLIGACIONES */}
                <Text style={styles.sectionTitle}>3. Seguridad y Obligaciones Mutuas</Text>

                <View style={styles.warningBox}>
                    <Text style={styles.warningTitle}>🛡️ COMPROMISO DE SEGURIDAD</Text>
                    <Text style={styles.warningText}>
                        Cualquier acción que atente contra la seguridad de las personas resultará en:
                        {'\n'}• Cierre inmediato de cuenta
                        {'\n'}• Prohibición permanente de uso
                        {'\n'}• Reporte a autoridades correspondientes
                        {'\n'}• Apoyo legal completo a la víctima
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>3.1 Obligaciones del Profesional</Text>
                <Text style={styles.paragraph}>
                    El profesional <Text style={styles.bold}>DEBE</Text>:{'\n'}
                    ✓ Solicitar <Text style={styles.bold}>consentimiento explícito</Text> antes de ingresar al domicilio{'\n'}
                    ✓ Respetar la privacidad y seguridad del cliente{'\n'}
                    ✓ Verificar que existe un <Text style={styles.bold}>espacio limpio y adecuado</Text> para realizar el servicio{'\n'}
                    ✓ <Text style={styles.bold}>Reportar</Text> el servicio completado en la app{'\n'}
                    ✓ <Text style={styles.bold}>NO</Text> solicitar contacto personal antes de completar el servicio{'\n'}
                    ✓ Mantener actividad constante en la plataforma
                </Text>

                <Text style={styles.subsectionTitle}>3.2 Obligaciones del Cliente</Text>
                <Text style={styles.paragraph}>
                    El cliente <Text style={styles.bold}>DEBE</Text>:{'\n'}
                    ✓ Otorgar <Text style={styles.bold}>consentimiento explícito</Text> para el ingreso del profesional{'\n'}
                    ✓ Proveer un <Text style={styles.bold}>espacio limpio, seguro y adecuado</Text> para el servicio{'\n'}
                    ✓ Asegurar la seguridad del profesional durante la visita{'\n'}
                    ✓ <Text style={styles.bold}>NO</Text> solicitar servicios fuera de la plataforma hasta completar el servicio actual{'\n'}
                    ✓ Reportar cualquier incidente de seguridad
                </Text>

                <Divider style={styles.divider} />

                {/* 4. PENALIZACIONES */}
                <Text style={styles.sectionTitle}>4. Penalizaciones y Sanciones</Text>

                <View style={styles.dangerBox}>
                    <Text style={styles.dangerTitle}>⛔ TOLERANCIA CERO</Text>
                    <Text style={styles.dangerText}>
                        Ante cualquier SOSPECHA de riesgo a la seguridad, la cuenta será bloqueada inmediatamente sin admisión previa.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>4.1 Servicios No Reportados</Text>
                <Text style={styles.paragraph}>
                    Si un profesional <Text style={styles.bold}>NO reporta servicios</Text> completados o <Text style={styles.bold}>comparte contacto</Text> antes de finalizar en la app:{'\n'}
                    • <Text style={styles.bold}>Primera vez</Text>: Advertencia formal{'\n'}
                    • <Text style={styles.bold}>Segunda vez</Text>: Suspensión temporal (7 días){'\n'}
                    • <Text style={styles.bold}>Tercera vez</Text>: Suspensión extendida (30 días){'\n'}
                    • <Text style={styles.bold}>Reincidencia</Text>: Bloqueo permanente
                </Text>

                <Text style={styles.subsectionTitle}>4.2 Inactividad</Text>
                <Text style={styles.paragraph}>
                    La <Text style={styles.bold}>inactividad prolongada</Text> sin servicios registrados puede resultar en:{'\n'}
                    • Reducción de visibilidad en búsquedas{'\n'}
                    • Suspensión temporal de la cuenta{'\n'}
                    • Bloqueo si no se detecta actividad legítima
                </Text>

                <Text style={styles.subsectionTitle}>4.3 Violación de Seguridad</Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>CUALQUIER</Text> acto que comprometa la seguridad:{'\n'}
                    • <Text style={styles.bold}>Cierre inmediato y permanente</Text> de la cuenta{'\n'}
                    • Reporte a autoridades policiales/judiciales{'\n'}
                    • <Text style={styles.bold}>Prohibición total</Text> de acceso a la plataforma{'\n'}
                    • Colaboración completa en procesos legales
                </Text>

                <Divider style={styles.divider} />

                {/* 5. APOYO LEGAL */}
                <Text style={styles.sectionTitle}>5. Apoyo Legal</Text>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>FreshApp se compromete a</Text>:{'\n\n'}
                        ✓ Proveer toda la información necesaria a las autoridades{'\n'}
                        ✓ Apoyar a la víctima en procesos judiciales{'\n'}
                        ✓ Colaborar activamente con la investigación{'\n'}
                        ✓ Preservar evidencia digital{'\n'}
                        ✓ Testificar si es requerido
                    </Text>
                </View>

                <Divider style={styles.divider} />

                {/* 6. RESPONSABILIDADES */}
                <Text style={styles.sectionTitle}>6. Responsabilidades de la Plataforma</Text>
                <Text style={styles.paragraph}>
                    FreshApp actúa como <Text style={styles.bold}>intermediario</Text> entre clientes y profesionales. Nuestra responsabilidad incluye:{'\n'}
                    • Verificación básica de identidad{'\n'}
                    • Monitoreo de actividad sospechosa{'\n'}
                    • Sistema de reportes y denuncias{'\n'}
                    • Colaboración con autoridades{'\n'}
                    • Implementación de medidas de seguridad
                </Text>

                <Text style={styles.paragraph}>
                    Sin embargo, <Text style={styles.bold}>cada usuario es responsable</Text> de sus propias acciones y debe ejercer su propio juicio de seguridad.
                </Text>

                <Divider style={styles.divider} />

                {/* 7. ACEPTACIÓN */}
                <Text style={styles.sectionTitle}>7. Aceptación de Términos</Text>
                <Text style={styles.paragraph}>
                    Al usar FreshApp, <Text style={styles.bold}>confirmas que</Text>:{'\n'}
                    ✓ Has leído y comprendido estos términos{'\n'}
                    ✓ Te comprometes a cumplir con todas las normas de seguridad{'\n'}
                    ✓ Entiendes las penalizaciones por incumplimiento{'\n'}
                    ✓ Aceptas la cooperación con autoridades si es necesario
                </Text>

                <View style={styles.footerBox}>
                    <Text style={styles.footerText}>
                        Para consultas sobre estos términos: legal@freshapp.com
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
        padding: 20,
        paddingBottom: 40,
    },
    updateDate: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 20,
        marginBottom: 12,
    },
    subsectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        color: theme.colors.text,
        lineHeight: 22,
        marginBottom: 12,
    },
    bold: {
        fontWeight: '600',
        color: theme.colors.text,
    },
    divider: {
        marginVertical: 20,
    },
    alertBox: {
        backgroundColor: '#FFF3CD',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC107',
        marginBottom: 20,
    },
    alertText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#856404',
        lineHeight: 20,
    },
    warningBox: {
        backgroundColor: '#FFF3E0',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
        marginBottom: 16,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 8,
    },
    warningText: {
        fontSize: 14,
        color: '#E65100',
        lineHeight: 22,
    },
    dangerBox: {
        backgroundColor: '#FFEBEE',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.error,
        marginBottom: 16,
    },
    dangerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#C62828',
        marginBottom: 8,
    },
    dangerText: {
        fontSize: 14,
        color: '#C62828',
        lineHeight: 22,
        fontWeight: '600',
    },
    infoBox: {
        backgroundColor: '#E3F2FD',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.info,
        marginBottom: 16,
    },
    infoText: {
        fontSize: 14,
        color: '#0D47A1',
        lineHeight: 22,
    },
    footerBox: {
        backgroundColor: theme.colors.grey100,
        padding: 16,
        borderRadius: 8,
        marginTop: 24,
    },
    footerText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});
